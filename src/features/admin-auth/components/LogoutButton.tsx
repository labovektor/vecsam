"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminAuthAction } from "@/hooks/use-admin-auth-action";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const LogoutButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { signOut, loading } = useAdminAuthAction();

  const handleLogout = async () => {
    const res = await signOut();
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    setIsOpen(false);
    router.replace("/");
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button disabled={loading} variant="destructive">
          Keluar
          <LogOut />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Kamu Benar-Benar Yakin?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleLogout}
          >
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
