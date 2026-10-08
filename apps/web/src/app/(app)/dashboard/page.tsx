import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await getCurrentUser();
  const firstName = user.profile?.firstName;
  const year = user.profile?.academicYear?.name;

  return (
    <>
      <PageHeader
        title={firstName ? `Bonjour ${firstName}` : "Bonjour"}
        description={year ? `Année : ${year}` : "Complète ton profil pour personnaliser ton parcours."}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Progression générale</CardTitle>
          <CardDescription className="mt-2">
            Ton niveau réel sera calculé à partir de tes premières activités (QCM, cas cliniques,
            tuteur). Il n’est pas encore disponible.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>Prochaine étape</CardTitle>
          <CardDescription className="mt-2">
            {user.profile
              ? `Objectif de ${user.profile.dailyMinutes} min par jour. Les premiers exercices arrivent dans la phase 1.`
              : "Indique ton année, ton objectif et ton temps de révision dans ton profil."}
          </CardDescription>
        </Card>
      </div>
    </>
  );
}
