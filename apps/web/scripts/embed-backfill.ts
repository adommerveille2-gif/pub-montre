// Calcule les embeddings des fragments importés avant l'activation de la clé d'embeddings.
// Usage : pnpm --filter @pub-montre/web embed:backfill
import { embedMissingChunks } from "../src/server/documents/embed";
import { prisma } from "@pub-montre/db";

async function main() {
  let total = 0;
  for (;;) {
    const done = await embedMissingChunks();
    total += done;
    if (done === 0) break;
  }
  console.info(`${total} fragments vectorisés.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
