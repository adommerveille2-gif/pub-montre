import type { Metadata } from "next";
import { prisma } from "@pub-montre/db";
import { can } from "@pub-montre/core";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/admin/action-form";
import { requireCapability } from "@/server/admin/guard";
import { setRoleAction } from "../actions";

export const metadata: Metadata = { title: "Utilisateurs" };

const ROLE_LABEL = { STUDENT: "Étudiant", CONTENT_REVIEWER: "Relecteur", ADMIN: "Administrateur" } as const;

export default async function UsersPage() {
  const me = await requireCapability("admin:view");
  const canManage = can(me.role, "users:manage");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, email: true, role: true, profile: { select: { firstName: true } } },
  });

  return (
    <>
      <PageHeader title="Utilisateurs" description="Les 100 comptes les plus récents. Seul un administrateur peut changer un rôle." />
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.profile?.firstName ?? user.email}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              {canManage && user.id !== me.id ? (
                <ActionForm action={setRoleAction} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={user.id} />
                  <select name="role" defaultValue={user.role} aria-label={`Rôle de ${user.email}`} className="h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground">
                    <option value="STUDENT">Étudiant</option>
                    <option value="CONTENT_REVIEWER">Relecteur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                  <Button type="submit" size="sm" variant="secondary">Enregistrer</Button>
                </ActionForm>
              ) : (
                <span className="text-sm text-muted-foreground">{ROLE_LABEL[user.role]}{user.id === me.id ? " (vous)" : ""}</span>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
