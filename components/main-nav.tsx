"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.organizationId}/works`,
      label: 'Trabajos',
      active: pathname === `/${params.organizationId}/works`,
    },
    {
      href: `/${params.organizationId}/categories`,
      label: 'Categorías',
      active: pathname === `/${params.organizationId}/categories`,
    },
    {
      href: `/${params.organizationId}/technologies`,
      label: 'Tecnologías',
      active: pathname === `/${params.organizationId}/technologies`,
    },
    {
      href: `/${params.organizationId}/companies`,
      label: 'Comañías',
      active: pathname === `/${params.organizationId}/companies`,
    },
    {
      href: `/${params.organizationId}/availabilities`,
      label: 'Disponibilidad',
      active: pathname === `/${params.organizationId}/availabilities`,
    },
    {
      href: `/${params.organizationId}/modalities`,
      label: 'Modalidad',
      active: pathname === `/${params.organizationId}/modalities`,
    },
    {
      href: `/${params.organizationId}/locations`,
      label: 'Ubicación',
      active: pathname === `/${params.organizationId}/locations`,
    },
    {
      href: `/${params.organizationId}/settings`,
      label: 'Opciones',
      active: pathname === `/${params.organizationId}/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
