"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, AvailabilityColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface AvailabilitiesClientProps {
  data: AvailabilityColumn[];
}

export const AvailabilitiesClient: React.FC<AvailabilitiesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Disponibilidades (${data.length})`} description="Administra los tipos de disponibilidad" />
        <Button onClick={() => router.push(`/${params.organizationId}/availabilities/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Availabilities" />
      <Separator />
      <ApiList entityName="availabilities" entityIdName="availabilityId" />
    </>
  );
};
