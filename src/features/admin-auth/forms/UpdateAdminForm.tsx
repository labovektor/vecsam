import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const updateAdminSchema = z.object({
  name: z.string().min(3, "Harus diisi!"),
});

const UpdateAdminForm = ({
  cValue,
}: {
  cValue: Partial<{ name: string; email: string }>;
}) => {
  const form = useForm<z.infer<typeof updateAdminSchema>>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      name: cValue.name || "",
    },
  });

  const updateAdmin = api.adminAuth.update.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Profil berhasil diupdate");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const resetPassword = api.adminAuth.resetPasswordReq.useMutation({
    onSuccess: () => {
      toast.success(
        "Kami telah mengirimkan link reset password ke email Anda.",
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof updateAdminSchema>) {
    updateAdmin.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Email</FormLabel>
          <Input value={cValue.email || ""} disabled />
        </div>
        <div className="space-y-2">
          <FormLabel>Password</FormLabel>
          <Button
            type="button"
            variant="outline"
            disabled={resetPassword.isPending}
            onClick={() => {
              if (!cValue.email) return;
              resetPassword.mutate({ email: cValue.email });
            }}
          >
            Reset Password
          </Button>
        </div>
        <Button
          type="submit"
          disabled={updateAdmin.isPending || !form.formState.isDirty}
        >
          Simpan
        </Button>
      </form>
    </Form>
  );
};

export default UpdateAdminForm;
