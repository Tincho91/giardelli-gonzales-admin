"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Clipboard } from "lucide-react"

import { CellAction } from "./cell-action"

export type UserColumn = {
  id: string
  name: string;
  createdAt: string;
  cvUrl: string;
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "cvUrl",
    cell: ({ row }) => row.original.cvUrl ? (
      <a
        href={row.original.cvUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View CV"
      >
        <p>ver cv</p>
        <Clipboard />
      </a>
    ) : null,
    header: "CV",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Acciones",
  },
];
