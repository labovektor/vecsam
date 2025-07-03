import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExamLoginForm from "@/features/participant-auth/forms/ExamLoginForm";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const ByByePage = () => {
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
          <CardTitle>Terima Kasih!</CardTitle>
          <CardDescription>
            Anda telah menyelesaikan ujian, terima kasih!
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Link className={buttonVariants({ variant: "default" })} href="/">
            Kembali ke Beranda <ArrowRight />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ByByePage;
