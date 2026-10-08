import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { searchOwnPassages } from "@/server/documents/search";
import { UploadForm } from "./upload-form";
import { DocumentList } from "./document-list";

export const metadata: Metadata = { title: "Mes documents" };

export default function DocumentsPage(props: PageProps<"/cours/documents">) {
  return (
    <>
      <PageHeader title="Mes documents" description="Tes propres cours, consultables et utilisables par le tuteur." />
      <Suspense fallback={null}>
        <DocumentsSection {...props} />
      </Suspense>
    </>
  );
}

async function DocumentsSection({ searchParams }: PageProps<"/cours/documents">) {
  const user = await getCurrentUser();
  const { q: rawQuery } = await searchParams;
  const query = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 200) : "";

  const documents = await prisma.courseDocument.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, filename: true, status: true, errorMessage: true, sizeBytes: true },
  });
  const passages = query ? await searchOwnPassages(user.id, query, 10) : [];

  return (
    <div className="grid gap-6">
      <UploadForm />

      <Card>
        <CardTitle>Rechercher dans mes cours</CardTitle>
        <form className="mt-4 flex flex-wrap gap-3" role="search">
          <label htmlFor="q" className="sr-only">Rechercher</label>
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Ex. insuffisance cardiaque"
            className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button type="submit" className="h-10 cursor-pointer rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Rechercher
          </button>
        </form>
        {query ? (
          <ul className="mt-5 grid gap-4">
            {passages.length === 0 ? (
              <li className="text-sm text-muted-foreground">Aucun passage trouvé dans tes cours pour « {query} ».</li>
            ) : (
              passages.map((passage) => (
                <li key={passage.chunkId} className="rounded-xl bg-muted p-4 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">
                    {passage.documentTitle}
                    {passage.pageRef ? ` · p. ${passage.pageRef}` : ""}
                  </p>
                  <p className="mt-2 leading-relaxed text-foreground">{passage.content}</p>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </Card>

      <section aria-labelledby="my-docs" className="grid gap-4">
        <h2 id="my-docs" className="text-lg font-semibold text-foreground">Tes documents</h2>
        {documents.length === 0 ? (
          <Card>
            <CardDescription>Aucun document importé pour l’instant.</CardDescription>
          </Card>
        ) : (
          <DocumentList documents={documents} />
        )}
      </section>

      <Link href="/cours" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
        ← Retour aux cours validés
      </Link>
    </div>
  );
}
