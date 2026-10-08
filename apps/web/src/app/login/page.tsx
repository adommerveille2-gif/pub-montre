import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          <p className="text-sm font-medium text-primary">Tuteur médical personnel</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            De la 1re à la 6e année, un accompagnement qui s’adapte à ton niveau.
          </p>
        </header>
        <Card>
          <LoginForm />
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Outil éducatif. Il ne remplace pas un avis médical et ne sert pas au diagnostic ni au traitement de patients.
        </p>
      </div>
    </main>
  );
}
