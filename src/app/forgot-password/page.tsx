import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminForgotPasswordForm from "@/features/admin-auth/forms/AdminForgotPassword";
import React from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="flex h-svh w-full items-center justify-center p-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Lupa Password</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
