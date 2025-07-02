import { ExamSidebar } from "@/components/exam-sidebar";
import ExamTopBar from "@/components/exam-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ExamProvider from "@/features/exam/provider/ExamProvider";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExamProvider>
      <SidebarProvider>
        <ExamSidebar />
        <SidebarInset>
          <ExamTopBar />
          <div className="h-full p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ExamProvider>
  );
}
