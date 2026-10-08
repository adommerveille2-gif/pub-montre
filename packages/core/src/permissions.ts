/** Droits par rôle. Une seule table, testée : toute action d'administration passe par `can`. */

export type Role = "STUDENT" | "CONTENT_REVIEWER" | "ADMIN";

export type Capability =
  | "admin:view"
  | "content:edit"
  | "content:review"
  | "taxonomy:edit"
  | "users:manage";

const MATRIX: Record<Role, readonly Capability[]> = {
  STUDENT: [],
  CONTENT_REVIEWER: ["admin:view", "content:review"],
  ADMIN: ["admin:view", "content:edit", "content:review", "taxonomy:edit", "users:manage"],
};

export function can(role: Role, capability: Capability): boolean {
  return MATRIX[role].includes(capability);
}
