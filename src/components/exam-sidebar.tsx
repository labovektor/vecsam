"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Image from "next/image";
import { useExam } from "@/hooks/use-exam";
import { cn } from "@/lib/utils";

export function ExamSidebar() {
  const {
    exam,
    focusedQuestion,
    setFocusedQuestion,
    focusedSection,
    setFocusedSection,
    answers,
  } = useExam();
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Image src="/vecsys.svg" alt="logo" width={130} height={100} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {exam?.sections.map((section) => {
          return (
            <SidebarGroup key={section.id}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid grid-cols-5 gap-3">
                  {section.questions.map((question) => (
                    <Button
                      key={question.id}
                      size="icon"
                      variant="outline"
                      className={cn(
                        answers[question.id] && "border-green-600 bg-green-100",
                        question.id === focusedQuestion?.id &&
                          "bg-primary text-white",
                      )}
                      onClick={() => {
                        setFocusedQuestion(question);
                        if (focusedSection?.id !== section.id) {
                          setFocusedSection(section);
                        }
                      }}
                    >
                      {question.number}
                    </Button>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
