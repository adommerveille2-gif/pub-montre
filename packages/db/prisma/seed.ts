// Données initiales : années 1 à 6 et liste de matières de départ.
// Ce ne sont que des données de base, modifiables ensuite depuis l'administration.
// `prisma db seed` est idempotent (upsert).
import { prisma } from "../src/client.ts";

const YEARS = [1, 2, 3, 4, 5, 6] as const;

const SUBJECTS = [
  "Anatomie",
  "Physiologie",
  "Biochimie",
  "Biologie cellulaire",
  "Histologie",
  "Génétique",
  "Immunologie",
  "Microbiologie",
  "Parasitologie",
  "Pharmacologie",
  "Pathologie",
  "Sémiologie",
  "Cardiologie",
  "Pneumologie",
  "Neurologie",
  "Gastro-entérologie",
  "Néphrologie",
  "Endocrinologie",
  "Hématologie",
  "Infectiologie",
  "Pédiatrie",
  "Gynécologie-obstétrique",
  "Chirurgie",
  "Médecine d'urgence",
] as const;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  for (const order of YEARS) {
    await prisma.academicYear.upsert({
      where: { order },
      update: {},
      create: { order, name: `${order}${order === 1 ? "re" : "e"} année` },
    });
  }

  for (const name of SUBJECTS) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }

  console.info(`Seed terminé : ${YEARS.length} années, ${SUBJECTS.length} matières.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
