import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExamLoginForm from "@/features/participant-auth/forms/ExamLoginForm";
import Image from "next/image";

import React from "react";

const AdminLoginPage = () => {
  return (
    <div className="flex h-svh w-full items-center justify-center p-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Image
            src="/vecsys.svg"
            alt="logo"
            width={160}
            height={100}
            className="mx-auto"
          />
          <CardTitle>Exam Login</CardTitle>
          <CardDescription>
            Masukkan kode peserta dan kode ujian Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExamLoginForm />
        </CardContent>
        <CardFooter>
          <CardDescription>
            Belum mendapatkan username dan kode ujian? harap hubungi panitia.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
