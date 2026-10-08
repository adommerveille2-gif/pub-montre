import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readPublishedFile } from "@/server/anatomy/models";

/** Fichier 3D d'une structure publiée. Réservé aux comptes connectés. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Non connecté.", { status: 401 });

  const { id } = await context.params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) return new NextResponse("Introuvable.", { status: 404 });

  const bytes = await readPublishedFile(id);
  if (!bytes) return new NextResponse("Introuvable.", { status: 404 });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "model/gltf-binary",
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
