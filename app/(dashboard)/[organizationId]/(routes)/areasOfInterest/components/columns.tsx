"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type AreaOfInterestColumn = {
  id: string
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<AreaOfInterestColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Acciones",
  },
];
