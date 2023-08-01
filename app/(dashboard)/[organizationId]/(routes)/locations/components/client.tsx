"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, LocationColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface LocationsClientProps {
  data: LocationColumn[];
}

export const LocationsClient: React.FC<LocationsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Ubicaciones (${data.length})`} description="Administra las Ubicaciones" />
        <Button onClick={() => router.push(`/${params.organizationId}/locations/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Locations" />
      <Separator />
      <ApiList entityName="locations" entityIdName="locationId" />
    </>
  );
};
