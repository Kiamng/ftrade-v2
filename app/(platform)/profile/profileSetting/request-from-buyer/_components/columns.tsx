import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../../../components/data-table-column-header";

import { requestTableData } from "@/types/request";
import { RequestRowActions } from "./row-action";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const requestColumns: ColumnDef<requestTableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "buyer.userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
  },
  {
    accessorKey: "productBuyer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User's Product" />
    ),
    cell: ({ row }) => {
      row.original.productBuyer && (
        <div className="flex space-x-2">
          <div className="w-[26px] h-[26px]">
            <img
              src={row.original.productBuyer?.imagePro}
              height={0}
              width={0}
              alt="product img"
              className="w-full h-full"
            />
          </div>
        </div>
      );
    },
  },
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
        <p>{row.original.productSeller.title}</p>
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
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
  {
    id: "actions",
    cell: ({ row }) => <RequestRowActions row={row} />,
  },
];
