import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import LogoutButton from "@/features/admin-auth/components/LogoutButton";

const DashboardTopBar = async () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-slate-50 px-4">
      <SidebarTrigger />
      <LogoutButton />
    </header>
  );
};

export default DashboardTopBar;
