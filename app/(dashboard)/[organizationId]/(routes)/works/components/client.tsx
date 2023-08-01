"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { WorkColumn, columns } from "./columns";

interface WorksClientProps {
  data: WorkColumn[];
};

export const WorksClient: React.FC<WorksClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Trabajos (${data.length})`} description="Administra los Trabajos disponibles" />
        <Button onClick={() => router.push(`/${params.organizationId}/works/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear nuevo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Works" />
      <Separator />
      <ApiList entityName="works" entityIdName="workId" />
    </>
  );
};
