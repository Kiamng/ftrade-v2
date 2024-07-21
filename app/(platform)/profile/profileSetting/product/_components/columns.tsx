import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../../../components/data-table-column-header";

import { Product } from "@/types/product";
import { labels, statuses } from "@/data/data";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { format } from "date-fns";

interface Category {
  name: string;
}
const shouldIncludeDenyRes = true;
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "productId",
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.title);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "imagePro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <div className="w-[26px] h-[26px]">
        <img
          src={row.original.imagePro}
          height={0}
          width={0}
          alt="product img"
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "genre.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Genre" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "city.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.status}{" "}
        {row.original.denyRes ? <span>, {row.original.denyRes}</span> : ""}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created date" />
    ),
    cell: ({ row }) => (
      <span>{format(row.original.createdDate, "HH:mm dd/MM/yyyy")}</span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "isDisplay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Display" />
    ),
    cell: ({ row }) => <span>{row.original.isDisplay}</span>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
