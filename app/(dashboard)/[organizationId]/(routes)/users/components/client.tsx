"use client";

import { useParams } from "next/navigation";

import { UserDataTable } from "@/components/ui/user-data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, UserColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface UsersClientProps {
  data: UserColumn[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ data }) => {
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Usuarios (${data.length})`} description="Administra las Usuarios" />
      </div>
      <Separator />
      <UserDataTable
        searchKey="name"
        columns={columns}
        data={data}
      />
      <Heading title="API" description="API Calls for Users" />
      <Separator />
      <ApiList entityName="users" entityIdName="userId" />
    </>
  );
};
