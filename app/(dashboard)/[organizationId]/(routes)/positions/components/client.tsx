"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { PositionColumn, columns } from "./columns";

interface PositionsClientProps {
  data: PositionColumn[];
};

export const PositionsClient: React.FC<PositionsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Puestos (${data.length})`} description="Administra los Puestos de trabajo disponibles" />
        <Button onClick={() => router.push(`/${params.organizationId}/positions/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear nuevo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Positions" />
      <Separator />
      <ApiList entityName="positions" entityIdName="positionId" />
    </>
  );
};
