import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/index.ts";

async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "AuditLog", "UserAchievement", "Achievement", "StudySession", "StudyPlan",
      "LlmUsage", "Message", "Conversation", "LearningRecommendation", "ReviewItem",
      "MasteryState", "LearningEvent", "QuizAttempt", "QuizItem", "Quiz",
      "QuestionConcept", "QuestionOption", "Question", "ClinicalCaseStep", "ClinicalCase",
      "Flashcard", "AnatomyModel", "MedicalSource", "DocumentChunk", "CourseDocument",
      "Course", "Concept", "Chapter", "SubjectYear", "Subject", "AcademicYear",
      "StudentProfile", "Session", "Account", "VerificationToken", "User"
    CASCADE
  `);
}

async function createConceptFixture() {
  const year = await prisma.academicYear.create({ data: { order: 3, name: "3e année" } });
  const subject = await prisma.subject.create({
    data: { name: "Cardiologie", slug: "cardiologie" },
  });
  const subjectYear = await prisma.subjectYear.create({
    data: { academicYearId: year.id, subjectId: subject.id },
  });
  const chapter = await prisma.chapter.create({
    data: { subjectYearId: subjectYear.id, title: "Insuffisance cardiaque" },
  });
  return prisma.concept.create({
    data: { chapterId: chapter.id, title: "Physiopathologie de l'insuffisance cardiaque" },
  });
}

describe("schéma de base de données", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("refuse deux utilisateurs avec le même e-mail", async () => {
    await prisma.user.create({ data: { email: "etudiant@example.com" } });
    await expect(
      prisma.user.create({ data: { email: "etudiant@example.com" } }),
    ).rejects.toThrow();
  });

  it("applique les rôles par défaut à STUDENT", async () => {
    const user = await prisma.user.create({ data: { email: "a@example.com" } });
    expect(user.role).toBe("STUDENT");
  });

  it("refuse deux états de maîtrise pour le même couple utilisateur / concept", async () => {
    const concept = await createConceptFixture();
    const user = await prisma.user.create({ data: { email: "b@example.com" } });
    await prisma.masteryState.create({ data: { userId: user.id, conceptId: concept.id } });
    await expect(
      prisma.masteryState.create({ data: { userId: user.id, conceptId: concept.id } }),
    ).rejects.toThrow();
  });

  it("supprime les données personnelles en cascade avec le compte", async () => {
    const concept = await createConceptFixture();
    const user = await prisma.user.create({ data: { email: "c@example.com" } });
    await prisma.studentProfile.create({ data: { userId: user.id, firstName: "Thomas" } });
    await prisma.learningEvent.create({
      data: { userId: user.id, conceptId: concept.id, source: "QCM", score: 1 },
    });

    await prisma.user.delete({ where: { id: user.id } });

    expect(await prisma.studentProfile.count({ where: { userId: user.id } })).toBe(0);
    expect(await prisma.learningEvent.count({ where: { userId: user.id } })).toBe(0);
    expect(await prisma.concept.count({ where: { id: concept.id } })).toBe(1);
  });

  it("permet à une matière d'appartenir à plusieurs années sans doublon", async () => {
    const y2 = await prisma.academicYear.create({ data: { order: 2, name: "2e année" } });
    const y3 = await prisma.academicYear.create({ data: { order: 3, name: "3e année" } });
    const subject = await prisma.subject.create({
      data: { name: "Pharmacologie", slug: "pharmacologie" },
    });
    await prisma.subjectYear.create({ data: { academicYearId: y2.id, subjectId: subject.id } });
    await prisma.subjectYear.create({ data: { academicYearId: y3.id, subjectId: subject.id } });

    await expect(
      prisma.subjectYear.create({ data: { academicYearId: y2.id, subjectId: subject.id } }),
    ).rejects.toThrow();
  });
});
