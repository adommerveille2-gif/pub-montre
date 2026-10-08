import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { loadPublishedAnatomy } from "@/server/anatomy/models";
import { AnatomyViewer } from "@/components/anatomy/anatomy-viewer";

export const metadata: Metadata = { title: "Anatomie 3D" };

export default function AnatomyPage() {
  return (
    <>
      <PageHeader title="Anatomie 3D" description="Explore les structures en trois dimensions. Usage pédagogique." />
      <Suspense fallback={null}>
        <Viewer />
      </Suspense>
    </>
  );
}

async function Viewer() {
  await getCurrentUser();
  const groups = await loadPublishedAnatomy();

  if (groups.length === 0) {
    return (
      <Card>
        <CardTitle>Aucun modèle publié pour l’instant</CardTitle>
        <CardDescription className="mt-2">
          Les modèles sont ajoutés après vérification de leur licence et relecture pédagogique. Nous ne présentons jamais une
          approximation comme une représentation exacte du corps humain.
        </CardDescription>
      </Card>
    );
  }

  return (
    <AnatomyViewer
      groups={groups.map((group) => ({
        url: `/api/anatomy/${group.fileId}`,
        license: group.license,
        sourceName: group.sourceName,
        structures: group.structures,
      }))}
    />
  );
}
