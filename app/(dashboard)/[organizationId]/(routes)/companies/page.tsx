import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { CompanyColumn } from "./components/columns"
import { CompaniesClient } from "./components/client";

const CompaniesPage = async ({
  params
}: {
  params: { organizationId: string }
}) => {
  const companies = await prismadb.company.findMany({
    where: {
      organizationId: params.organizationId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCompanies: CompanyColumn[] = companies.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CompaniesClient data={formattedCompanies} />
      </div>
    </div>
  );
};

export default CompaniesPage;
