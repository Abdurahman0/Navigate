import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    throw new Error("ADMIN_EMAIL is required for seeding admin user");
  }

  const plainPassword = process.env.ADMIN_PASSWORD;
  const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;

  const passwordHash = hashFromEnv || (plainPassword ? await bcrypt.hash(plainPassword, 10) : await bcrypt.hash("admin12345", 10));

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
    },
  });
}

async function seedSiteSettings() {
  const existing = await prisma.siteSetting.findFirst();

  const data = {
    phone: "+44 20 7946 0123",
    email: "info@navigate-academy.com",
    telegram: "@NaviGateSupport",
    whatsapp: "https://wa.me/442079460123",
    brochureUrl: "https://example.com/brochure.pdf",
    addressEn: "Level 5, Education Plaza, London, UK",
    addressRu: "Уровень 5, Education Plaza, Лондон, Великобритания",
    addressUz: "5-qavat, Education Plaza, London, UK",
    workingHoursEn: "Mon-Fri 09:00-20:00",
    workingHoursRu: "Пн-Пт 09:00-20:00",
    workingHoursUz: "Du-Ju 09:00-20:00",
  };

  if (existing) {
    await prisma.siteSetting.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSetting.create({ data });
  }
}

async function seedCourses() {
  await prisma.course.deleteMany();

  await prisma.course.createMany({
    data: [
      {
        slug: "ielts-academic-mastery",
        category: "IELTS",
        titleEn: "IELTS Academic Mastery",
        titleRu: "IELTS Academic Mastery",
        titleUz: "IELTS Academic Mastery",
        descriptionEn: "Comprehensive IELTS preparation focused on band 7+ outcomes.",
        descriptionRu: "Комплексная подготовка к IELTS с фокусом на результат 7+.",
        descriptionUz: "IELTS bo'yicha 7+ natijaga yo'naltirilgan to'liq tayyorgarlik.",
        duration: "12 Weeks",
        level: "Intermediate+",
        schedule: "Mon, Wed, Fri",
        price: "$349",
        status: "Enrollment Open",
        imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
        isPublished: true,
      },
      {
        slug: "sat-elite-prep",
        category: "SAT",
        titleEn: "SAT Elite Prep",
        titleRu: "SAT Elite Prep",
        titleUz: "SAT Elite Prep",
        descriptionEn: "Advanced SAT math and verbal strategy program.",
        descriptionRu: "Продвинутая программа по SAT математике и verbal стратегиям.",
        descriptionUz: "SAT matematika va verbal strategiyalari bo'yicha ilg'or dastur.",
        duration: "14 Weeks",
        level: "Advanced",
        schedule: "Tue, Thu",
        price: "$850",
        status: "Enrollment Open",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        isPublished: true,
      },
    ],
  });
}

async function seedTeachers() {
  await prisma.teacher.deleteMany();

  await prisma.teacher.createMany({
    data: [
      {
        name: "Dr. Helena Vance",
        roleEn: "IELTS Specialist",
        roleRu: "Специалист по IELTS",
        roleUz: "IELTS mutaxassisi",
        bioEn: "Former examiner focused on high-band writing and speaking preparation.",
        bioRu: "Бывший экзаменатор, специализируется на writing/speaking для высоких баллов.",
        bioUz: "Sobiq examiner, yuqori ball uchun writing va speaking tayyorgarligiga ixtisoslashgan.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        experience: "12+ years",
        specialization: "IELTS",
        isPublished: true,
      },
      {
        name: "Marcus Sterling",
        roleEn: "SAT Math Coach",
        roleRu: "Тренер по SAT Math",
        roleUz: "SAT Math murabbiyi",
        bioEn: "Expert in evidence-based SAT quant strategy and score improvement.",
        bioRu: "Эксперт по SAT quant стратегиям и росту результатов.",
        bioUz: "SAT quant strategiyalari va natija oshirish bo'yicha ekspert.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        experience: "8+ years",
        specialization: "SAT",
        isPublished: true,
      },
    ],
  });
}

async function seedResults() {
  await prisma.result.deleteMany();

  await prisma.result.createMany({
    data: [
      {
        studentName: "Arjun Mehta",
        examType: "IELTS Academic",
        beforeScore: "5.5",
        afterScore: "7.5",
        quoteEn: "The weekly mock tests and feedback changed everything.",
        quoteRu: "Еженедельные mock тесты и обратная связь все изменили.",
        quoteUz: "Haftalik mock testlar va feedback hammasini o'zgartirdi.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        isPublished: true,
      },
      {
        studentName: "Sofia Chen",
        examType: "SAT Prep",
        beforeScore: "1180",
        afterScore: "1450",
        quoteEn: "Clear strategy and disciplined practice gave me confidence.",
        quoteRu: "Четкая стратегия и практика дали мне уверенность.",
        quoteUz: "Aniq strategiya va intizomli mashg'ulotlar menga ishonch berdi.",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        isPublished: true,
      },
    ],
  });
}

async function seedTestimonials() {
  await prisma.testimonial.deleteMany();

  await prisma.testimonial.createMany({
    data: [
      {
        name: "James Wilson",
        quoteEn: "I improved two full IELTS bands in four months.",
        quoteRu: "Я повысил IELTS на два полных бэнда за четыре месяца.",
        quoteUz: "To'rt oy ichida IELTS natijamni ikki bandga oshirdim.",
        descriptorEn: "IELTS Candidate",
        descriptorRu: "Кандидат IELTS",
        descriptorUz: "IELTS nomzodi",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        isPublished: true,
      },
      {
        name: "Ahnaya Roy",
        quoteEn: "The SAT methods were practical and highly effective.",
        quoteRu: "Методы SAT были практичными и очень эффективными.",
        quoteUz: "SAT metodlari amaliy va juda samarali bo'ldi.",
        descriptorEn: "SAT Candidate",
        descriptorRu: "Кандидат SAT",
        descriptorUz: "SAT nomzodi",
        imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
        isPublished: true,
      },
    ],
  });
}

async function main() {
  await seedAdminUser();
  await seedSiteSettings();
  await seedCourses();
  await seedTeachers();
  await seedResults();
  await seedTestimonials();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Prisma seed completed");
  })
  .catch(async (error) => {
    console.error("Prisma seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
