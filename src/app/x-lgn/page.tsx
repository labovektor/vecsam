import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExamLoginForm from "@/features/participant-auth/forms/ExamLoginForm";

import React from "react";

const AdminLoginPage = () => {
  return (
    <div className="flex h-svh w-full items-center justify-center p-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Exam Login</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamLoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
