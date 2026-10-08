import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

/** Espace réservé pour une section livrée dans une phase ultérieure. Ne propose aucune action factice. */
export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: number;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <CardTitle>Bientôt disponible</CardTitle>
        <CardDescription className="mt-2">
          Cette section sera livrée dans la phase {phase} de la feuille de route.
        </CardDescription>
      </Card>
    </>
  );
}
