"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, CompanyColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface CompaniesClientProps {
  data: CompanyColumn[];
}

export const CompaniesClient: React.FC<CompaniesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Compañías (${data.length})`} description="Administra las Companías" />
        <Button onClick={() => router.push(`/${params.organizationId}/companies/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Companies" />
      <Separator />
      <ApiList entityName="companies" entityIdName="companyId" />
    </>
  );
};
