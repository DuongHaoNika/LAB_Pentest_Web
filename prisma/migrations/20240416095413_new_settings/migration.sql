-- CreateTable
CREATE TABLE "VulnSetting" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VulnSetting_pkey" PRIMARY KEY ("id")
);
