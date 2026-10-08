import type { Metadata } from "next";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ActionForm } from "@/components/admin/action-form";
import { requireCapability } from "@/server/admin/guard";
import { can } from "@pub-montre/core";
import { importAnatomyAction, setAnatomyFileStatusAction } from "../actions";

export const metadata: Metadata = { title: "Modèles 3D" };

export default async function AnatomyAdminPage() {
  const me = await requireCapability("admin:view");
  const canEdit = can(me.role, "content:edit");
  const canReview = can(me.role, "content:review");
  const rows = await prisma.anatomyModel.findMany({
    where: { storageKey: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { name: true, structureKey: true, storageKey: true, status: true, license: true, sourceName: true },
  });

  const files = new Map<string, { storageKey: string; status: string; license: string; sourceName: string; structures: string[] }>();
  for (const row of rows) {
    const key = row.storageKey!;
    const file = files.get(key) ?? { storageKey: key, status: row.status, license: row.license, sourceName: row.sourceName, structures: [] };
    file.structures.push(`${row.name} (${row.structureKey})`);
    files.set(key, file);
  }

  return (
    <>
      <PageHeader title="Modèles 3D" description="Un modèle n'est publié qu'après relecture, avec sa licence et sa source renseignées." />

      {canEdit ? (
        <Card className="mb-8">
          <CardTitle>Importer un modèle GLB</CardTitle>
          <CardDescription className="mt-1">Une structure par ligne : nom de maille, nom affiché, description. Le nom de maille doit correspondre à celui du fichier.</CardDescription>
          <ActionForm action={importAnatomyAction} className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="glb">Fichier GLB (50 Mo maximum)</Label>
              <input id="glb" name="file" type="file" accept=".glb,model/gltf-binary" className="text-sm text-muted-foreground" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="license">Licence</Label>
                <Input id="license" name="license" maxLength={200} required placeholder="CC BY 4.0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="sourceName" maxLength={200} required placeholder="Nom de l'éditeur du modèle" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="structures">Structures</Label>
              <textarea id="structures" name="structures" rows={4} required placeholder={"heart.left_ventricle | Ventricule gauche | Cavité principale du cœur gauche."} className="rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground" />
            </div>
            <Button type="submit" className="w-fit">Importer en brouillon</Button>
          </ActionForm>
        </Card>
      ) : null}

      <section aria-labelledby="files" className="grid gap-4">
        <h2 id="files" className="text-lg font-semibold text-foreground">Fichiers importés</h2>
        {files.size === 0 ? <Card><CardDescription>Aucun modèle importé.</CardDescription></Card> : null}
        {[...files.values()].map((file) => (
          <Card key={file.storageKey} className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{file.status === "VALIDATED" ? "Publié" : "Brouillon"} · {file.license} · {file.sourceName}</span>
              {canReview ? (
                <ActionForm action={setAnatomyFileStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="storageKey" value={file.storageKey} />
                  {file.status === "VALIDATED" ? (
                    <Button type="submit" name="status" value="DRAFT" variant="secondary" size="sm">Retirer</Button>
                  ) : (
                    <Button type="submit" name="status" value="VALIDATED" size="sm">Publier</Button>
                  )}
                </ActionForm>
              ) : null}
            </div>
            <ul className="grid gap-1 text-sm text-foreground">
              {file.structures.map((structure) => <li key={structure}>{structure}</li>)}
            </ul>
          </Card>
        ))}
      </section>
    </>
  );
}
