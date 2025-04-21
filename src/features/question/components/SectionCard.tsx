import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Section } from "@prisma/client";
import { Pencil } from "lucide-react";
import React from "react";
import { formatSectionType } from "../schema";
import { Badge } from "@/components/ui/badge";

export const SectionCard = ({ section }: { section: Section }) => {
  return (
    <Card key={section.id} className="group h-fit">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <div className="flex gap-1">
          <Badge variant="secondary">{section.points} Poin</Badge>
          <Badge variant="secondary">{formatSectionType(section.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex h-0 justify-end gap-1 overflow-hidden transition-all group-hover:h-9">
        <Button size="icon">
          <Pencil />
        </Button>
        {/* <Button
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
        </Button> */}
      </CardContent>
    </Card>
  );
};
