"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  addSectionSchema,
  formatSectionType,
  updateSectionSchema,
  type AddSectionSchemaType,
  type UpdateSectionSchemaType,
} from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, LoaderCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionType, type Section } from "@prisma/client";
import { Button } from "@/components/ui/button";

const EditSectionForm = ({
  currentSection,
  onSuccess,
  onCancel,
}: {
  currentSection: Section;
  onSuccess: VoidFunction;
  onCancel: VoidFunction;
}) => {
  const form = useForm<UpdateSectionSchemaType>({
    resolver: zodResolver(updateSectionSchema),
    defaultValues: {
      id: currentSection.id,
      title: currentSection.title,
      type: currentSection.type as string,
      points: currentSection.points,
    },
  });

  const updateSection = api.question.updateSection.useMutation({
    onSuccess: onSuccess,
  });

  return (
    <Card>
      <CardContent>
        <div className="flex justify-end py-0">
          <Button onClick={onCancel} variant="ghost" size="icon">
            <X />
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
              updateSection.mutate({ ...data });
            })}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Point per question</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SectionType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {formatSectionType(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={updateSection.isPending}
            >
              {updateSection.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Check />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditSectionForm;
