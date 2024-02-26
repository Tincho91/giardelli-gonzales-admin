"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Modal } from "@/components/ui/modal";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Position, AreaOfInterest, Company, Availability, Modality, Location } from "@prisma/client";
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  isArchived: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  areaOfInterestId: z.string().min(1),
  companyId: z.string().min(1),
  availabilityId: z.string().min(1),
  modalityId: z.string().min(1),
  locationId: z.string().min(1),
});

type PositionFormValues = z.infer<typeof formSchema>

interface PositionFormProps {
  initialData: Position | null;
  areasOfInterest: AreaOfInterest[];
  companies: Company[];
  availabilities: Availability[];
  modalities: Modality[];
  locations: Location[];
};

interface CustomEditorProps {
  value: string;
  onChange: (data: { text: string; html: string }) => void;
  // Add any other necessary properties based on your requirements
}

const dummyRenderHTML = (text: string) => text;

export const PositionForm: React.FC<PositionFormProps> = ({
  initialData,
  areasOfInterest,
  companies,
  availabilities,
  modalities,
  locations,
}) => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);


  const title = initialData ? 'Editar Puesto' : 'Crear Puesto';
  const description = initialData ? 'Editar un Puesto.' : 'Agregar nuevo Puesto';
  const toastMessage = initialData ? 'Puesto actualizado.' : 'Puesto creado.';
  const action = initialData ? 'Guarder cambios' : 'Crear';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    isFeatured: false,
    isArchived: false,
    areasOfInterest: [],
  }

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: Omit<PositionFormValues, 'areasOfInterest'>) => {
    try {
      setLoading(true);
      const formData = {
        ...data,
      };
      if (initialData) {
        await axios.patch(`/api/${params.organizationId}/positions/${params.positionId}`, formData);
      } else {
        await axios.post(`/api/${params.organizationId}/positions`, formData);
      }
      router.refresh();
      router.push(`/${params.organizationId}/positions`);
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
      await axios.delete(`/api/${params.organizationId}/positions/${params.positionId}`);
      router.refresh();
      router.push(`/${params.organizationId}/positions`);
      toast.success('Position deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
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
                    <Input disabled={loading} placeholder="Nombre del Puesto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Corta</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="Descripción corta del trabajo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mt-2 mb-1">Descripción Larga</FormLabel>
                  <FormControl>
                    <Button onClick={() => setIsEditorModalOpen(true)}>Editar Descripción Larga</Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="areaOfInterestId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área de Interés</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecciona un Área de Intrés" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areasOfInterest.map((areaOfInterest) => (
                        <SelectItem key={areaOfInterest.id} value={areaOfInterest.id}>{areaOfInterest.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecciona una Compañia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availabilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecciona la Disponibilidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availabilities.map((availability) => (
                        <SelectItem key={availability.id} value={availability.id}>{availability.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modalityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecciona la Modalidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modalities.map((modality) => (
                        <SelectItem key={modality.id} value={modality.id}>{modality.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecciona la Ubicación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Destacado
                    </FormLabel>
                    <FormDescription>
                      Este Puesto aparecerá en la página principal
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archivado
                    </FormLabel>
                    <FormDescription>
                      Este Puesto no se mostrará en la web
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Modal
        title="Editar Descripción Larga"
        description="Modifica la descripción larga del puesto."
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
      >
        <ReactQuill
          theme="snow"
          value={form.watch('longDescription')}
          onChange={(content) => form.setValue('longDescription', content)}
          style={{ height: '70vh', marginBottom: '50px' }} // Ajusta el estilo según necesites
        />
      </Modal>
    </>
  );
};
