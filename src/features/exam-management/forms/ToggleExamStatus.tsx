"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import React, { startTransition } from "react";
import { toast } from "sonner";

const ToggleExamStatus = ({
  currentActive,
  id,
}: {
  currentActive: boolean;
  id: string;
}) => {
  const [s, setS] = React.useState(currentActive);
  const [isActive, setOptimisticStatus] = React.useOptimistic(
    s,
    (_, newStatus: boolean) => newStatus,
  );

  const toggleExamStatus = api.examManagement.toggleStatus.useMutation({
    onSuccess: () => {
      toast.success("Status Updated");
      setS(!isActive);
    },
    onError: (err) => {
      toast.error(err.message);
      setS(s);
    },
  });

  return (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-full px-3 py-2",
        isActive ? "bg-primary-foreground" : "bg-muted",
      )}
    >
      <Switch
        id="exam-status"
        checked={isActive}
        disabled={toggleExamStatus.isPending}
        onCheckedChange={() => {
          startTransition(() => {
            setOptimisticStatus(!s);
            toggleExamStatus.mutateAsync({ id });
          });
        }}
      />
      <Label htmlFor="exam-status">{isActive ? "Active" : "Inactive"}</Label>
    </div>
  );
};

export default ToggleExamStatus;
