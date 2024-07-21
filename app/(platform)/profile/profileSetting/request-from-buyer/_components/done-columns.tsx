import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../../../components/data-table-column-header";

import {
  doneRequestData,
  requestTableData,
  yourRequest,
} from "@/types/request";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export const doneRequestHistoryColumns: ColumnDef<doneRequestData>[] = [
  {
    accessorKey: "productSeller",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="My product" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <div className="w-[26px] h-[26px]">
          <img
            src={row.original.productSeller?.imagePro}
            height={0}
            width={0}
            alt="product img"
            className="w-full h-full object-cover"
          />
        </div>
        <Link href={`/product/${row.original.productSeller.productId}`}>
          {row.original.productSeller.title}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "productBuyer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User's Product" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <div className="w-[26px] h-[26px]">
          <img
            src={row.original.productBuyer?.imagePro}
            height={0}
            width={0}
            alt="product img"
            className="w-full h-full object-cover"
          />
        </div>
        <Link href={`/product/${row.original.productBuyer?.productId}`}>
          {row.original.productBuyer?.title}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "productSeller.genre.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Genre" />
    ),
    cell: ({ row }) => <span>{row.original.productSeller.genre.name}</span>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "buyer.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => <span>{row.original.buyer.userName}</span>,
  },

  {
    accessorKey: "rate.rated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => (
      <span className="flex flex-col items-start space-y-4">
        <span className="flex space-x-1">
          {[...Array(5)].map((star, index) => {
            return (
              <FaStar
                key={index}
                color={index + 1 <= row.original.rate.rated ? "yellow" : "gray"}
              />
            );
          })}
        </span>
        <span>{row.original.rate.descript}</span>
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request at" />
    ),
    cell: ({ row }) => (
      <span>{format(row.original.createdDate, "HH:mm dd/MM/yyyy")}</span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
