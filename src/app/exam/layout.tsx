import { ExamSidebar } from "@/components/exam-sidebar";
import ExamTopBar from "@/components/exam-topbar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import QuestionNavigator from "@/features/exam/components/QuestionNavigator";
import ExamProvider from "@/features/exam/provider/ExamProvider";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExamProvider>
      <ContextMenu>
        <ContextMenuTrigger className="w-full">
          <SidebarProvider>
            <ExamSidebar />
            <SidebarInset>
              <ExamTopBar />
              <div className="flex h-full flex-col p-4">
                <div className="flex-1">{children}</div>
                <QuestionNavigator />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ContextMenuTrigger>
      </ContextMenu>
    </ExamProvider>
  );
}
