import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminResetPasswordForm from "@/features/admin-auth/forms/AdminResetPasswordForm";
import React from "react";

const ResetPasswordPage = () => {
  return (
    <div className="flex h-svh w-full items-center justify-center p-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
