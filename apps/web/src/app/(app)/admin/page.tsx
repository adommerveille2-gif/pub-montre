import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { requireCapability } from "@/server/admin/guard";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminHome() {
  const user = await requireCapability("admin:view");
  const [students, pendingQuestions, validatedQuestions, draftChapters, validatedChapters, recentAudit] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.question.count({ where: { status: "DRAFT" } }),
    prisma.question.count({ where: { status: "VALIDATED" } }),
    prisma.chapter.count({ where: { status: "DRAFT" } }),
    prisma.chapter.count({ where: { status: "VALIDATED" } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, action: true, entityType: true, createdAt: true } }),
  ]);

  return (
    <>
      <PageHeader title="Administration" description={`Connecté en tant que ${user.role === "ADMIN" ? "administrateur" : "relecteur"}.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Étudiants" value={students} />
        <Stat label="Questions à relire" value={pendingQuestions} href="/admin/questions" />
        <Stat label="Questions publiées" value={validatedQuestions} />
        <Stat label="Chapitres en brouillon" value={draftChapters} href="/admin/taxonomie" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{validatedChapters} chapitres publiés.</p>
      <nav aria-label="Raccourcis" className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/admin/taxonomie" className="text-primary underline-offset-4 hover:underline">Taxonomie</Link>
        <Link href="/admin/questions" className="text-primary underline-offset-4 hover:underline">Questions</Link>
        <Link href="/admin/anatomie" className="text-primary underline-offset-4 hover:underline">Modèles 3D</Link>
        <Link href="/admin/utilisateurs" className="text-primary underline-offset-4 hover:underline">Utilisateurs</Link>
      </nav>
      <Card className="mt-6">
        <CardTitle>Activité récente</CardTitle>
        <ul className="mt-4 grid gap-2 text-sm">
          {recentAudit.length === 0 ? <li className="text-muted-foreground">Aucune action pour l’instant.</li> : null}
          {recentAudit.map((entry) => (
            <li key={entry.id} className="flex justify-between gap-4">
              <span className="text-foreground">{entry.action}</span>
              <span className="text-muted-foreground">{entry.entityType} · {entry.createdAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const body = (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </Card>
  );
  return href ? <Link href={href} className="block rounded-2xl">{body}</Link> : body;
}
