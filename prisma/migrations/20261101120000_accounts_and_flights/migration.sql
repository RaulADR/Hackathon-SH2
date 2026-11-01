-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateTable
CREATE TABLE "PilotProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "operatorId" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "registration" TEXT NOT NULL DEFAULT '',
    "insuranceUntil" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PilotProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drone" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "massGrams" DOUBLE PRECISION NOT NULL,
    "droneClass" TEXT NOT NULL,
    "cameraModel" TEXT NOT NULL,
    "cameraResolution" TEXT NOT NULL,

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flightDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "drone" TEXT NOT NULL,
    "droneId" TEXT,
    "purpose" TEXT NOT NULL,
    "pilot" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "operatorId" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "registration" TEXT NOT NULL DEFAULT '',
    "insuranceUntil" TEXT NOT NULL DEFAULT '',
    "contacts" TEXT NOT NULL DEFAULT '[]',
    "droneMassGrams" DOUBLE PRECISION,
    "droneClass" TEXT,
    "tower" TEXT,
    "flightCategory" TEXT,
    "operationMode" TEXT,
    "maxAltitude" TEXT,
    "signatureDataUrl" TEXT,
    "ctrIndicator" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'prepared',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlightPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightDocument" (
    "id" TEXT NOT NULL,
    "flightPlanId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlightDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PilotProfile_userId_key" ON "PilotProfile"("userId");

-- CreateIndex
CREATE INDEX "Drone_profileId_idx" ON "Drone"("profileId");

-- CreateIndex
CREATE INDEX "FlightPlan_flightDate_idx" ON "FlightPlan"("flightDate");

-- CreateIndex
CREATE INDEX "FlightPlan_userId_flightDate_idx" ON "FlightPlan"("userId", "flightDate");

-- CreateIndex
CREATE INDEX "FlightDocument_flightPlanId_idx" ON "FlightDocument"("flightPlanId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotProfile" ADD CONSTRAINT "PilotProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drone" ADD CONSTRAINT "Drone_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PilotProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightPlan" ADD CONSTRAINT "FlightPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightPlan" ADD CONSTRAINT "FlightPlan_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightDocument" ADD CONSTRAINT "FlightDocument_flightPlanId_fkey" FOREIGN KEY ("flightPlanId") REFERENCES "FlightPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
