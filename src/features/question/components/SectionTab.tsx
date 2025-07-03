"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import {
  AlertCircle,
  Loader,
  LoaderCircle,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import React from "react";
import { formatSectionType } from "../schema";
import AddSectionForm from "../form/AddSectionForm";
import EditSectionForm from "../form/EditSectionForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Section } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

const SectionTab = ({
  examId,
  className,
  onSelected,
  selectedSectionId,
}: {
  examId: string;
  className?: string;
  onSelected: (section: Section) => void;
  selectedSectionId: string | null;
}) => {
  const queryClient = useQueryClient();

  const [visibleAddSection, setVisibleAddSection] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const {
    data: sections,
    error,
    refetch,
    isLoading,
  } = api.section.getSections.useQuery({
    examId,
  });
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const removeSection = api.section.deleteSection.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <CardTitle className="mb-2">Bagian-Bagian</CardTitle>

      <ScrollArea className="h-[calc(100svh-14rem)] scroll-m-2">
        <div className="space-y-2">
          {isLoading && (
            <div className="flex w-full items-center justify-center">
              <LoaderCircle className="animate-spin" />
            </div>
          )}
          {sections?.map((section) => (
            <div key={section.id}>
              {editingId === section.id ? (
                <EditSectionForm
                  currentSection={section}
                  onCancel={() => setEditingId(null)}
                  onSuccess={() => {
                    setEditingId(null);
                    refetch();
                    queryClient.refetchQueries({
                      queryKey: getQueryKey(api.question.getQuestions),
                    });
                  }}
                />
              ) : (
                <Card
                  className={cn(
                    "group h-fit cursor-pointer hover:bg-blue-50",
                    selectedSectionId === section.id &&
                      "border-blue-500 bg-blue-50",
                  )}
                  onClick={() => onSelected(section)}
                >
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="default">
                        {formatSectionType(section.type)}
                      </Badge>
                      <Badge variant="secondary">
                        poin benar: {section.correctPoint}
                      </Badge>
                      <Badge variant="secondary">
                        poin salah: {section.wrongPoint}
                      </Badge>
                      <Badge variant="secondary">
                        poin dikosongi: {section.passPoint}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      selectedSectionId === section.id ? "h-9" : "h-0",
                      "flex justify-end gap-1 overflow-hidden transition-all group-hover:h-9",
                    )}
                  >
                    <Button
                      size="icon"
                      onClick={() => setEditingId(section.id)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      disabled={removeSection.isPending}
                      onClick={() => removeSection.mutate({ id: section.id })}
                    >
                      {removeSection.isPending ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Trash />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
        <div className={` ${visibleAddSection ? "block" : "hidden"}`}>
          <AddSectionForm
            examId={examId}
            onSuccess={() => {
              refetch();
              setVisibleAddSection(false);
            }}
            onCancel={() => {
              setVisibleAddSection(false);
            }}
          />
        </div>

        <Button
          className={` ${visibleAddSection ? "hidden" : "flex"} mt-2 w-full`}
          onClick={() => setVisibleAddSection(true)}
        >
          <Plus />
        </Button>
      </ScrollArea>
    </div>
  );
};

export default SectionTab;
