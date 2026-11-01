import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "../../../../generated/account-prisma";

import type { LocalPlan } from "~/lib/local-plan";
import { areasOverlap, type LatLngPoint } from "~/lib/geometry";
import { getRomaniaTime } from "~/lib/time";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const pointSchema = z.tuple([
  z.number().min(43.3).max(48.6),
  z.number().min(19.5).max(30.2),
]);

const areaSchema = z.array(pointSchema).min(3).max(60);
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
    );
  }, "Enter a valid calendar date.");
const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/)
  .refine((value) => {
    const [hour, minute] = value.split(":").map(Number);
    return hour! < 24 && minute! < 60;
  }, "Enter a valid time.");
const statusSchema = z.enum(["prepared", "sent", "approved"]);
const droneClassSchema = z.enum(["none", "C0", "C1", "C2", "C3", "C4"]);

const planInput = z.object({
  flightDate: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  area: areaSchema,
  droneId: z.string().min(1).max(64),
  purpose: z.string().trim().min(1).max(500),
  contacts: z.array(z.string().email().max(254)).max(100),
  tower: z.string().max(120),
  flightCategory: z.enum(["A1", "A2", "A3"]),
  operationMode: z.enum([
    "Visual Line Of Sight (VLOS)",
    "Beyond Visual Line Of Sight (BVLOS)",
  ]),
  maxAltitude: z.string().max(10),
  signatureDataUrl: z
    .string()
    .max(1_000_000)
    .regex(/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/),
  ctrIndicator: z.boolean(),
});

const flightSelection = {
  id: true,
  userId: true,
  flightDate: true,
  startTime: true,
  endTime: true,
  area: true,
  drone: true,
  purpose: true,
  pilot: true,
  email: true,
  phone: true,
  operatorId: true,
  location: true,
  registration: true,
  insuranceUntil: true,
  contacts: true,
  droneMassGrams: true,
  droneClass: true,
  tower: true,
  flightCategory: true,
  operationMode: true,
  maxAltitude: true,
  signatureDataUrl: true,
  ctrIndicator: true,
  status: true,
  createdAt: true,
  documents: {
    select: {
      id: true,
      documentType: true,
      fileName: true,
      mimeType: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

type FlightPlanWithDocuments = Prisma.FlightPlanGetPayload<{
  select: typeof flightSelection;
}>;

function mapFlightPlan(plan: FlightPlanWithDocuments): LocalPlan {
  const parsedDroneClass = droneClassSchema.safeParse(plan.droneClass);
  return {
    id: plan.id,
    flightDate: plan.flightDate,
    startTime: plan.startTime,
    endTime: plan.endTime,
    area: JSON.parse(plan.area) as LatLngPoint[],
    drone: plan.drone,
    purpose: plan.purpose,
    pilot: plan.pilot,
    email: plan.email,
    phone: plan.phone,
    operatorId: plan.operatorId,
    location: plan.location,
    registration: plan.registration,
    insuranceUntil: plan.insuranceUntil,
    contacts: JSON.parse(plan.contacts) as string[],
    ...(plan.droneMassGrams !== null
      ? { droneMassGrams: plan.droneMassGrams }
      : {}),
    ...(parsedDroneClass.success ? { droneClass: parsedDroneClass.data } : {}),
    ...(plan.tower ? { tower: plan.tower } : {}),
    ...(plan.flightCategory ? { flightCategory: plan.flightCategory } : {}),
    ...(plan.operationMode ? { operationMode: plan.operationMode } : {}),
    ...(plan.maxAltitude ? { maxAltitude: plan.maxAltitude } : {}),
    ...(plan.signatureDataUrl
      ? { signatureDataUrl: plan.signatureDataUrl }
      : {}),
    ctrIndicator: plan.ctrIndicator,
    status: statusSchema.parse(plan.status),
    documents: plan.documents,
  };
}

function parseTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour! * 60 + minute!;
}

export const flightRouter = createTRPCRouter({
  candidateTimes: protectedProcedure
    .input(
      z.object({
        flightDate: dateSchema,
        duration: z.number().int().min(30).max(720),
        area: areaSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const plans = await ctx.db.flightPlan.findMany({
        where: { flightDate: input.flightDate },
        select: { startTime: true, endTime: true, area: true },
      });
      const now = getRomaniaTime();
      const slots: { startTime: string; endTime: string }[] = [];
      for (let start = 8 * 60; start + input.duration <= 20 * 60; start += 30) {
        if (
          input.flightDate < now.date ||
          (input.flightDate === now.date && start <= now.minutes)
        )
          continue;
        const end = start + input.duration;
        const conflict = plans.some((plan) => {
          if (
            parseTime(plan.startTime) >= end ||
            parseTime(plan.endTime) <= start
          )
            return false;
          try {
            return areasOverlap(
              input.area,
              JSON.parse(plan.area) as LatLngPoint[],
            );
          } catch (error) {
            console.error(
              "Skipping a saved flight plan with invalid area data.",
              error,
            );
            return false;
          }
        });
        if (!conflict) {
          slots.push({
            startTime: `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`,
            endTime: `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`,
          });
        }
      }
      return slots;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const plans = await ctx.db.flightPlan.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
      select: flightSelection,
    });
    return plans.map((plan) => mapFlightPlan(plan));
  }),

  prepare: protectedProcedure
    .input(planInput)
    .mutation(async ({ ctx, input }) => {
      const start = parseTime(input.startTime);
      const end = parseTime(input.endTime);
      if (start < 8 * 60 || end > 20 * 60 || end <= start) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose a valid flight window between 08:00 and 20:00.",
        });
      }

      if (input.flightDate < getRomaniaTime().date) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose today or a future date.",
        });
      }

      return ctx.db.$transaction(async (transaction) => {
        const overlaps = await transaction.flightPlan.findMany({
          where: {
            flightDate: input.flightDate,
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
          },
          select: { area: true },
        });
        const conflict = overlaps.some((plan) => {
          try {
            return areasOverlap(
              input.area,
              JSON.parse(plan.area) as LatLngPoint[],
            );
          } catch (error) {
            console.error(
              "Skipping a saved flight plan with invalid area data.",
              error,
            );
            return false;
          }
        });
        if (conflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "That time overlaps another Aerio planning draft in this installation. Select another candidate.",
          });
        }

        const profile = await transaction.pilotProfile.findUnique({
          where: { userId: ctx.userId },
        });
        const selectedDrone = await transaction.drone.findFirst({
          where: {
            id: input.droneId,
            profile: { userId: ctx.userId },
          },
        });
        if (!profile || !selectedDrone) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Complete your pilot profile and select one of your saved drones.",
          });
        }
        const pilot = `${profile.firstName} ${profile.lastName}`.trim();
        const droneLabel = `${selectedDrone.nickname} — ${selectedDrone.model} (${selectedDrone.massGrams} g, ${selectedDrone.droneClass}); ${selectedDrone.cameraModel} · ${selectedDrone.cameraResolution}`;
        const plan = await transaction.flightPlan.create({
          data: {
            userId: ctx.userId,
            droneId: selectedDrone.id,
            flightDate: input.flightDate,
            startTime: input.startTime,
            endTime: input.endTime,
            area: JSON.stringify(input.area),
            drone: droneLabel,
            purpose: input.purpose,
            pilot,
            email: profile.email,
            phone: profile.phone,
            operatorId: profile.operatorId,
            location: profile.location,
            registration: profile.registration,
            insuranceUntil: profile.insuranceUntil,
            contacts: JSON.stringify(input.contacts),
            droneMassGrams: selectedDrone.massGrams,
            droneClass: selectedDrone.droneClass,
            tower: input.tower,
            flightCategory: input.flightCategory,
            operationMode: input.operationMode,
            maxAltitude: input.maxAltitude,
            signatureDataUrl: input.signatureDataUrl,
            ctrIndicator: input.ctrIndicator,
            documents: {
              create: [
                {
                  documentType: "anexa1",
                  fileName: `aerio-anexa1-${input.flightDate}.pdf`,
                  mimeType: "application/pdf",
                },
                {
                  documentType: "flight-summary",
                  fileName: `aerio-flight-request-${input.flightDate}.txt`,
                  mimeType: "text/plain",
                },
                {
                  documentType: "flight-area",
                  fileName: `aerio-flight-area-${input.flightDate}.geojson`,
                  mimeType: "application/geo+json",
                },
              ],
            },
          },
          select: flightSelection,
        });
        return mapFlightPlan(plan);
      });
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.string().min(1), status: statusSchema }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.flightPlan.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data: { status: input.status },
      });
      if (result.count !== 1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const plan = await ctx.db.flightPlan.findFirstOrThrow({
        where: { id: input.id, userId: ctx.userId },
        select: flightSelection,
      });
      return mapFlightPlan(plan);
    }),
});
