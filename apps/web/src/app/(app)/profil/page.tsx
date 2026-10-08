import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/session";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profil" description="Ces informations personnalisent ton parcours." />
      <Suspense fallback={null}>
        <ProfileSection />
      </Suspense>
    </>
  );
}

async function ProfileSection() {
  const user = await getCurrentUser();
  const years = await prisma.academicYear.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  const profile = user.profile;
  return (
    <ProfileForm
      years={years}
      defaults={{
        firstName: profile?.firstName,
        university: profile?.university,
        academicYearId: profile?.academicYear?.id,
        goal: profile?.goal,
        dailyMinutes: profile?.dailyMinutes,
      }}
    />
  );
}
