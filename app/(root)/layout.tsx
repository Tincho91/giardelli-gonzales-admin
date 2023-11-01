import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const organization = await prismadb.organization.findFirst({
    where: {
      userId,
    }
  });

  if (organization) {
    redirect(`/${organization.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};