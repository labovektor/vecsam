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
import { AlertCircle, LoaderCircle, Pencil, Plus, Trash } from "lucide-react";
import React from "react";
import { formatSectionType } from "../schema";
import AddSectionForm from "../form/AddSectionForm";
import EditSectionForm from "../form/EditSectionForm";

const SectionTab = ({ examId }: { examId: string }) => {
  const [visibleAddSection, setVisibleAddSection] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const {
    data: sections,
    error,
    refetch,
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
    <div className="flex flex-col gap-2">
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
            <Card className="group h-fit">
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
                <Button size="icon" onClick={() => setEditingId(section.id)}>
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
        className={` ${visibleAddSection ? "hidden" : "flex"}`}
        onClick={() => setVisibleAddSection(true)}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default SectionTab;
