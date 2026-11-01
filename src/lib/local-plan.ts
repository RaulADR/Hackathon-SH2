import type { DroneClass } from "~/lib/drone";
import type { LatLngPoint } from "~/lib/geometry";

export type PlanStatus = "prepared" | "sent" | "approved";

export type LocalPlan = {
  id: string;
  flightDate: string;
  startTime: string;
  endTime: string;
  area: LatLngPoint[];
  drone: string;
  purpose: string;
  pilot: string;
  email: string;
  phone: string;
  operatorId: string;
  location: string;
  registration: string;
  insuranceUntil: string;
  contacts: string[];
  droneMassGrams?: number;
  droneClass?: DroneClass;
  tower?: string;
  flightCategory?: string;
  operationMode?: string;
  maxAltitude?: string;
  signatureDataUrl?: string;
  ctrIndicator?: boolean;
  status: PlanStatus;
};
