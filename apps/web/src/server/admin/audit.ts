import "server-only";
import { prisma, type Prisma } from "@pub-montre/db";

/** Trace une action d'administration. Les métadonnées ne doivent contenir ni mot de passe ni secret. */
export async function recordAudit(params: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      metadata: params.metadata ?? {},
    },
  });
}
