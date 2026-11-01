import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const droneSchema = z.object({
  id: z.string().min(1).max(64),
  nickname: z.string().trim().min(1).max(100),
  model: z.string().trim().min(1).max(120),
  massGrams: z.number().positive().max(100000),
  droneClass: z.enum(["none", "C0", "C1", "C2", "C3", "C4"]),
  cameraModel: z.string().trim().min(1).max(120),
  cameraResolution: z.string().trim().min(1).max(100),
});

const profileSchema = z.object({
  firstName: z.string().trim().max(80),
  lastName: z.string().trim().max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40),
  operatorId: z.string().trim().max(100),
  location: z.string().trim().max(180),
  registration: z.string().trim().max(100),
  insuranceUntil: z.string().max(10),
  drones: z.array(droneSchema).max(100),
});

export const accountRouter = createTRPCRouter({
  profile: protectedProcedure.query(({ ctx }) =>
    ctx.db.pilotProfile.findUnique({
      where: { userId: ctx.userId },
      include: { drones: { orderBy: { nickname: "asc" } } },
    }),
  ),

  saveProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (transaction) => {
        const { drones, ...profileData } = input;
        const profile = await transaction.pilotProfile.upsert({
          where: { userId: ctx.userId },
          create: { ...profileData, userId: ctx.userId },
          update: profileData,
        });
        const droneIds = drones.map((drone) => drone.id);

        for (const drone of drones) {
          const existing = await transaction.drone.findUnique({
            where: { id: drone.id },
            select: { profileId: true },
          });
          if (existing && existing.profileId !== profile.id) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "That drone is already assigned to another account.",
            });
          }
          if (existing) {
            await transaction.drone.update({
              where: { id: drone.id },
              data: { ...drone, profileId: profile.id },
            });
          } else {
            await transaction.drone.create({
              data: { ...drone, profileId: profile.id },
            });
          }
        }

        await transaction.drone.deleteMany({
          where: {
            profileId: profile.id,
            ...(droneIds.length > 0 ? { id: { notIn: droneIds } } : {}),
          },
        });
        return transaction.pilotProfile.findUniqueOrThrow({
          where: { id: profile.id },
          include: { drones: { orderBy: { nickname: "asc" } } },
        });
      });
    }),
});
