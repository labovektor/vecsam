"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  addSectionSchema,
  formatSectionType,
  type AddSectionSchemaType,
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
import { SectionType } from "@prisma/client";
import { Button } from "@/components/ui/button";

const AddSectionForm = ({
  examId,
  onSuccess,
  onCancel,
}: {
  examId: string;
  onSuccess: VoidFunction;
  onCancel: VoidFunction;
}) => {
  const form = useForm<AddSectionSchemaType>({
    resolver: zodResolver(addSectionSchema),
    defaultValues: {
      examId,
      title: "",
      type: "MULTIPLE_CHOICE",
      correctPoint: 1,
      wrongPoint: 0,
      passPoint: 0,
    },
  });

  const addSection = api.section.addSection.useMutation({
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
              addSection.mutate({ ...data });
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
                name="correctPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poin Benar</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wrongPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poin Salah</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poin Dikosongi</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <Button
              type="submit"
              className="w-full"
              disabled={addSection.isPending}
            >
              {addSection.isPending ? (
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

export default AddSectionForm;
