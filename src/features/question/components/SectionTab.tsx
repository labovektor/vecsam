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

const SectionTab = ({
  examId,
  className,
  onSelected,
}: {
  examId: string;
  className?: string;
  onSelected: (id: string) => void;
}) => {
  const [visibleAddSection, setVisibleAddSection] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const {
    data: sections,
    error,
    refetch,
    isLoading,
  } = api.question.getSections.useQuery({
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

  const removeSection = api.question.deleteSection.useMutation({
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
                  }}
                />
              ) : (
                <Card
                  className="group h-fit cursor-pointer hover:bg-blue-50"
                  onClick={() => onSelected(section.id)}
                >
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <div className="flex gap-1">
                      <Badge variant="secondary">{section.points} Poin</Badge>
                      <Badge variant="secondary">
                        {formatSectionType(section.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex h-0 justify-end gap-1 overflow-hidden transition-all group-hover:h-9">
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
