import { NextResponse } from "next/server";
import { prisma } from "@pub-montre/db";

/** Sonde pour l'hébergeur : vérifie que l'application répond et que la base est joignable. Ne révèle aucune configuration. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
