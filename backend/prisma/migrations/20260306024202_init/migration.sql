-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Enrolled', 'Rejected');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "examInterest" TEXT NOT NULL,
    "preferredTime" TEXT,
    "email" TEXT,
    "message" TEXT,
    "currentLevel" TEXT,
    "source" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleUz" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionUz" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "roleRu" TEXT NOT NULL,
    "roleUz" TEXT NOT NULL,
    "bioEn" TEXT NOT NULL,
    "bioRu" TEXT NOT NULL,
    "bioUz" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "beforeScore" TEXT NOT NULL,
    "afterScore" TEXT NOT NULL,
    "quoteEn" TEXT NOT NULL,
    "quoteRu" TEXT NOT NULL,
    "quoteUz" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quoteEn" TEXT NOT NULL,
    "quoteRu" TEXT NOT NULL,
    "quoteUz" TEXT NOT NULL,
    "descriptorEn" TEXT NOT NULL,
    "descriptorRu" TEXT NOT NULL,
    "descriptorUz" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "brochureUrl" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "addressRu" TEXT NOT NULL,
    "addressUz" TEXT NOT NULL,
    "workingHoursEn" TEXT NOT NULL,
    "workingHoursRu" TEXT NOT NULL,
    "workingHoursUz" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
