"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { AreaOfInterest } from "@prisma/client"
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
  name: z.string().min(2),
});

type AreaOfInterestFormValues = z.infer<typeof formSchema>

interface AreaOfInterestFormProps {
  initialData: AreaOfInterest | null;
};

export const AreaOfInterestForm: React.FC<AreaOfInterestFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Editar Área de Interés' : 'Crear Área de Interés';
  const description = initialData ? 'Editar una Área de Interés.' : 'Crear nueva Área de Interés.';
  const toastMessage = initialData ? 'Área de Interés actualizada.' : 'Área de Interés creada.';
  const action = initialData ? 'Guardar Cambios' : 'Crear';

  const form = useForm<AreaOfInterestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    }
  });

  const onSubmit = async (data: AreaOfInterestFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.organizationId}/areasOfInterest/${params.areaOfInterestId}`, data);
      } else {
        await axios.post(`/api/${params.organizationId}/areasOfInterest`, data);
      }
      router.refresh();
      router.push(`/${params.organizationId}/areasOfInterest`);
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
      await axios.delete(`/api/${params.organizationId}/areasOfInterest/${params.areaOfInterestId}`);
      router.refresh();
      router.push(`/${params.organizationId}/areasOfInterest`);
      toast.success('Área de Interés eliminada.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this AreaOfInterest first.');
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nombre del Área de interés" {...field} />
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
