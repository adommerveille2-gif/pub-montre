// CONTENU DE DÉMONSTRATION — à remplacer par du contenu rédigé et validé par des enseignants.
// Les questions sont marquées VALIDATED uniquement pour permettre de tester le parcours.
// Chaque entrée est identifiée par son énoncé ou son titre, ce qui rend le seed idempotent.
import { prisma } from "../src/client.ts";
import type { Difficulty, QuestionType } from "../src/generated/prisma/client.ts";

type DemoOption = { text: string; isCorrect: boolean };
type DemoQuestion = {
  statement: string;
  type: QuestionType;
  difficulty: Difficulty;
  explanation: string;
  pitfall?: string;
  memoryTip?: string;
  concepts: string[];
  options: DemoOption[];
};

const SOURCE_TITLE = "ESH Guidelines for the management of arterial hypertension (2023)";

const SAMPLE_QUESTIONS: DemoQuestion[] = [
  {
    statement: "Parmi ces propositions, lesquelles caractérisent l'insuffisance cardiaque à fraction d'éjection préservée (FEVG ≥ 50 %) ?",
    type: "QCM",
    difficulty: "MEDIUM",
    explanation:
      "Dans l'insuffisance cardiaque à FEVG préservée, la fraction d'éjection est conservée (≥ 50 %) mais le remplissage ventriculaire est altéré, avec des pressions de remplissage élevées et des signes de congestion. La dilatation du ventricule gauche n'est pas constante.",
    pitfall: "Confondre « FEVG préservée » avec « cœur normal » : les signes de congestion restent présents.",
    memoryTip: "FEVG conservée + congestion = remplissage altéré.",
    concepts: ["Physiopathologie de l'insuffisance cardiaque"],
    options: [
      { text: "FEVG ≥ 50 %", isCorrect: true },
      { text: "FEVG < 40 %", isCorrect: false },
      { text: "Signes de congestion avec pressions de remplissage élevées", isCorrect: true },
      { text: "Dilatation systématique du ventricule gauche", isCorrect: false },
    ],
  },
  {
    statement: "Concernant le potentiel d'action du myocyte ventriculaire, quelles affirmations sont exactes ?",
    type: "QCM",
    difficulty: "HARD",
    explanation:
      "La phase 0 est la dépolarisation rapide liée à l'entrée de sodium. Le plateau (phase 2) résulte de l'entrée de calcium par les canaux calciques de type L, contrebalancée par la sortie de potassium. La phase 4 correspond au potentiel de repos, principalement déterminé par la conductance potassique. La phase 1 n'est pas due au calcium.",
    pitfall: "Attribuer la phase 1 au calcium : elle est liée à la fermeture transitoire des canaux sodiques et à la sortie de potassium.",
    concepts: ["Potentiel d'action cardiaque"],
    options: [
      { text: "La phase 0 est due à l'entrée rapide de sodium", isCorrect: true },
      { text: "Le plateau (phase 2) est dû à l'entrée de calcium", isCorrect: true },
      { text: "La phase 1 est due à l'entrée de calcium", isCorrect: false },
      { text: "Le potentiel de repos (phase 4) dépend surtout de la conductance potassique", isCorrect: true },
    ],
  },
  {
    statement: "Quelle est la formule du débit cardiaque ?",
    type: "QCM",
    difficulty: "EASY",
    explanation:
      "Le débit cardiaque est le produit de la fréquence cardiaque par le volume d'éjection systolique (DC = FC × VES). Il vaut environ 5 L/min au repos chez l'adulte. La pression artérielle moyenne dépend du débit et des résistances : PAM = DC × RVS.",
    pitfall: "Inverser la relation avec les résistances : DC = PAM / RVS, pas PAM × RVS.",
    memoryTip: "Débit = fréquence × volume éjecté.",
    concepts: ["Débit cardiaque"],
    options: [
      { text: "DC = FC × VES", isCorrect: true },
      { text: "DC = PAM × RVS", isCorrect: false },
      { text: "DC ≈ 5 L/min au repos chez l'adulte", isCorrect: true },
      { text: "DC = VES / FC", isCorrect: false },
    ],
  },
  {
    statement: "Selon les recommandations ESH 2023, à partir de quelle valeur de pression artérielle de consultation parle-t-on d'hypertension artérielle ?",
    type: "QCM",
    difficulty: "EASY",
    explanation:
      "Au cabinet, l'hypertension est définie par une PAS ≥ 140 mmHg et/ou une PAD ≥ 90 mmHg. Les seuils plus bas ne définissent pas l'hypertension au sens de ces recommandations.",
    pitfall: "Utiliser les seuils d'autres sociétés savantes sans le préciser.",
    concepts: ["Hypertension artérielle"],
    options: [
      { text: "PAS ≥ 140 mmHg et/ou PAD ≥ 90 mmHg", isCorrect: true },
      { text: "PAS ≥ 130 mmHg et/ou PAD ≥ 80 mmHg", isCorrect: false },
    ],
  },
  {
    statement: "Sur un ECG chez l'adulte sans anomalie, quelles affirmations sont exactes ?",
    type: "QCM",
    difficulty: "EASY",
    explanation:
      "Chez l'adulte, l'intervalle PR est normalement compris entre 120 et 200 ms et la durée du QRS est inférieure à 120 ms. Un PR supérieur à 200 ms évoque un bloc auriculo-ventriculaire du premier degré.",
    pitfall: "Considérer un PR de 300 ms comme normal : il est allongé.",
    concepts: ["ECG normal"],
    options: [
      { text: "L'intervalle PR normal est d'environ 120 à 200 ms", isCorrect: true },
      { text: "La durée du QRS normale est inférieure à 120 ms", isCorrect: true },
      { text: "Un PR de 300 ms est normal", isCorrect: false },
    ],
  },
];

async function ensureSource() {
  const existing = await prisma.medicalSource.findFirst({ where: { title: SOURCE_TITLE } });
  if (existing) return existing;
  return prisma.medicalSource.create({
    data: { title: SOURCE_TITLE, type: "GUIDELINE", publisher: "ESH", year: 2023, validated: true },
  });
}

async function ensureSubjectYear(yearOrder: number, subjectName: string) {
  const year = await prisma.academicYear.findUniqueOrThrow({ where: { order: yearOrder } });
  const subject = await prisma.subject.findUniqueOrThrow({ where: { name: subjectName } });
  return prisma.subjectYear.upsert({
    where: { academicYearId_subjectId: { academicYearId: year.id, subjectId: subject.id } },
    update: {},
    create: { academicYearId: year.id, subjectId: subject.id },
  });
}

async function ensureChapter(subjectYearId: string, title: string, concepts: string[], course?: { title: string; content: string }) {
  let chapter = await prisma.chapter.findFirst({ where: { subjectYearId, title } });
  if (!chapter) {
    chapter = await prisma.chapter.create({
      data: { subjectYearId, title, status: "VALIDATED" },
    });
  }
  for (const [index, conceptTitle] of concepts.entries()) {
    const existing = await prisma.concept.findFirst({ where: { chapterId: chapter.id, title: conceptTitle } });
    if (!existing) {
      await prisma.concept.create({
        data: { chapterId: chapter.id, title: conceptTitle, position: index, status: "VALIDATED" },
      });
    }
  }
  if (course) {
    const existingCourse = await prisma.course.findFirst({ where: { chapterId: chapter.id, title: course.title } });
    if (!existingCourse) {
      await prisma.course.create({
        data: { chapterId: chapter.id, title: course.title, content: course.content, status: "VALIDATED" },
      });
    }
  }
  return chapter;
}

const DEMO_CASE = {
  title: "Dyspnée d'effort chez un patient de 58 ans (démonstration)",
  presentation: "Patient de 58 ans consultant pour une dyspnée d'effort progressive.",
  steps: [
    {
      stage: "Motif",
      prompt: "Quelles questions poseriez-vous pour préciser le motif de consultation ?",
      reveal: "Dyspnée d'effort progressive depuis 3 semaines, orthopnée (deux oreillers), prise de poids de 3 kg, œdèmes des chevilles.",
      hints: ["Pensez à la chronologie, à l'effort déclenchant et aux signes de congestion."],
      concept: "Physiopathologie de l'insuffisance cardiaque",
    },
    {
      stage: "Hypothèses",
      prompt: "Quelles hypothèses diagnostiques retenez-vous, et pourquoi ?",
      reveal: "Insuffisance cardiaque gauche (orthopnée, œdèmes, prise de poids). Diagnostics différentiels : BPCO, anémie, embolie pulmonaire.",
      hints: ["Les signes de congestion orientent vers le cœur, mais d'autres causes de dyspnée existent."],
      concept: "Physiopathologie de l'insuffisance cardiaque",
    },
    {
      stage: "Examens complémentaires",
      prompt: "Quels examens demandez-vous en première intention ?",
      reveal: "ECG, peptides natriurétiques (BNP ou NT-proBNP), radiographie thoracique, échocardiographie transthoracique, numération, ionogramme et créatinine.",
      hints: ["Pensez aux examens qui confirment la cause cardiaque et à ceux qui évaluent le retentissement."],
      concept: "ECG normal",
    },
    {
      stage: "Diagnostic probable",
      prompt: "Quel est le diagnostic le plus probable, et que précise l'échocardiographie ?",
      reveal: "Insuffisance cardiaque. L'échocardiographie précise la fraction d'éjection, qui détermine le phénotype (FEVG réduite ou préservée).",
      hints: ["Le phénotype dépend de la fraction d'éjection ventriculaire gauche."],
      concept: "Physiopathologie de l'insuffisance cardiaque",
    },
  ],
};

async function ensureDemoCase(chapterId: string) {
  const existing = await prisma.clinicalCase.findFirst({ where: { title: DEMO_CASE.title } });
  if (existing) return;
  const created = await prisma.clinicalCase.create({
    data: {
      chapterId,
      title: DEMO_CASE.title,
      difficulty: "MEDIUM",
      presentation: DEMO_CASE.presentation,
      status: "VALIDATED",
    },
  });
  for (const [index, step] of DEMO_CASE.steps.entries()) {
    const concept = await prisma.concept.findFirst({ where: { title: step.concept } });
    await prisma.clinicalCaseStep.create({
      data: {
        caseId: created.id,
        position: index + 1,
        stage: step.stage,
        prompt: step.prompt,
        reveal: step.reveal,
        hints: step.hints,
        conceptId: concept?.id ?? null,
      },
    });
  }
}

export async function seedDemoContent() {
  const source = await ensureSource();

  const physioYear = await ensureSubjectYear(2, "Physiologie");
  const cardioYear = await ensureSubjectYear(3, "Cardiologie");

  await ensureChapter(physioYear.id, "Physiologie cardiovasculaire", ["Potentiel d'action cardiaque", "Débit cardiaque"], {
    title: "Rappels : cycle cardiaque et débit",
    content:
      "Le débit cardiaque est le volume de sang éjecté par minute : DC = FC × VES.\n\nLe potentiel d'action du myocyte ventriculaire comporte cinq phases : dépolarisation rapide (sodium), repolarisation précoce (phase 1), plateau (calcium entrant compensé par le potassium sortant), repolarisation terminale (phase 3) et potentiel de repos (phase 4).",
  });

  await ensureChapter(cardioYear.id, "Insuffisance cardiaque", [
    "Physiopathologie de l'insuffisance cardiaque",
    "Hypertension artérielle",
    "ECG normal",
  ]);

  // Rattachement des questions aux notions.
  for (const demo of SAMPLE_QUESTIONS) {
    let question = await prisma.question.findFirst({ where: { statement: demo.statement } });
    const conceptRows = await prisma.concept.findMany({ where: { title: { in: demo.concepts } } });
    const chapterId = conceptRows[0]?.chapterId;
    if (!chapterId) throw new Error(`Notion introuvable pour : ${demo.statement}`);

    if (!question) {
      question = await prisma.question.create({
        data: {
          chapterId,
          type: demo.type,
          difficulty: demo.difficulty,
          statement: demo.statement,
          explanation: demo.explanation,
          pitfall: demo.pitfall ?? null,
          memoryTip: demo.memoryTip ?? null,
          status: "VALIDATED",
          sourceId: demo.concepts.includes("Hypertension artérielle") ? source.id : null,
          options: {
            create: demo.options.map((option, position) => ({ ...option, position })),
          },
          concepts: {
            create: conceptRows.map((concept) => ({ conceptId: concept.id })),
          },
        },
      });
    }
  }

  const cardioChapter = await prisma.chapter.findFirstOrThrow({ where: { title: "Insuffisance cardiaque" } });
  await ensureDemoCase(cardioChapter.id);

  console.info(`Contenu de démonstration : ${SAMPLE_QUESTIONS.length} questions, 1 cas clinique.`);
}
