"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { User } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"


const formSchema = z.object({
  keywords: z.string().regex(/^[\w\s]+(,[\w\s]+)*$/, "Use comas para separar las palabras. Sin espacios.")
});

type UserFormValues = z.infer<typeof formSchema>

interface UserFormProps {
  initialData: User | null;
};

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Editar Usuario' : 'Crear Usuario';
  const description = initialData ? 'Editar un Usuario.' : 'Crear nuevo Usuario.';
  const toastMessage = initialData ? 'Usuario actualizado.' : 'Usuario creado.';
  const action = initialData ? 'Guardar Cambios' : 'Crear';

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: initialData?.keywords ?? '', 
    }
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.organizationId}/users/${params.userId}`, data);
      } else {
        await axios.post(`/api/${params.organizationId}/users`, data);
      }
      router.refresh();
      router.push(`/${params.organizationId}/users`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.organizationId}/users/${params.userId}`);
      router.refresh();
      router.push(`/${params.organizationId}/users`);
      toast.success('Usuario eliminada.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this User first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palabras Clave</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Palabras separadas por coma, sin espacios." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
