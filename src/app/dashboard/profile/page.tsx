"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { data: user } = api.adminAuth.getUser.useQuery();

  const resetPassword = api.adminAuth.resetPasswordReq.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div>
      <Button
        onClick={() => {
          if (!user || !user.email) return;
          resetPassword.mutate({ email: user.email });
        }}
      >
        Reset Password
      </Button>
    </div>
  );
};

export default ProfilePage;
