"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, AreaOfInterestColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface AreasOfInterestClientProps {
  data: AreaOfInterestColumn[];
}

export const AreasOfInterestClient: React.FC<AreasOfInterestClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Áreas de Interés (${data.length})`} description="Administra las áreas de interés" />
        <Button onClick={() => router.push(`/${params.organizationId}/areasOfInterest/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Areas of Interest" />
      <Separator />
      <ApiList entityName="areasOfInterest" entityIdName="areaofInterestId" />
    </>
  );
};
