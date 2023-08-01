"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, ModalityColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface ModalitiesClientProps {
  data: ModalityColumn[];
}

export const ModalitiesClient: React.FC<ModalitiesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Modalidades (${data.length})`} description="Administra las Modalidades" />
        <Button onClick={() => router.push(`/${params.organizationId}/modalities/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Modalities" />
      <Separator />
      <ApiList entityName="modalities" entityIdName="modalityId" />
    </>
  );
};
