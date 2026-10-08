import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";

export function UserMenu({ userLabel }: { userLabel: string }) {
  return (
    <div className="border-t border-border p-4">
      <p className="truncate text-sm font-medium text-foreground" title={userLabel}>
        {userLabel}
      </p>
      <form action={signOutAction} className="mt-2">
        <Button type="submit" variant="ghost" size="sm" className="-ml-3 text-muted-foreground">
          <LogOut className="size-4" aria-hidden />
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
