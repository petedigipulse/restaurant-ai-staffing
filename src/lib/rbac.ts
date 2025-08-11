export type Role = "OWNER" | "MANAGER" | "STAFF";

export function requireRole<T extends Role>(role: Role, allowed: Role[], action: string): asserts role is T {
  if (!allowed.includes(role)) {
    throw new Error(`Forbidden: role ${role} is not allowed to ${action}`);
  }
}

export const RolePriority: Record<Role, number> = {
  OWNER: 3,
  MANAGER: 2,
  STAFF: 1,
};


