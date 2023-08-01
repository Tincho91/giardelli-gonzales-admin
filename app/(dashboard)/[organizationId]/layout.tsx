import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { organizationId: string }
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const organization = await prismadb.organization.findFirst({ 
    where: {
      id: params.organizationId,
      userId,
    }
   });

  if (!organization) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
