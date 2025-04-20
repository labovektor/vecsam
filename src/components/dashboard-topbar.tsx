import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const DashboardTopBar = async () => {
  return (
    <header className="flex justify-between sticky top-0 bg-slate-50 h-16 shrink-0 items-center gap-2 border-b px-4 z-30">
      <SidebarTrigger />
    </header>
  );
};

export default DashboardTopBar;
