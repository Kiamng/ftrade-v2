import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { productSchema } from "@/data/schema";
import { updateProductStatus } from "@/app/api/product/product.api";
import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = productSchema.parse(row.original);
  const session = useSession();
  const { toast } = useToast();
  const updateDisplay = async (display: string) => {
    try {
      if (
        product.status === "InExchange" ||
        product.status === "PendingExchange"
      ) {
        toast({
          description: "This product is exchanging !",
          variant: "destructive",
        });
        return;
      } else {
        const response = await updateProductStatus(
          product.productId,
          session.data?.user?.token as string,
          product.denyRes,
          product.status,
          display
        );
        if (response === 200) {
          toast({
            description: "Update display status successfully !",
          });
          window.location.reload();
        } else {
          toast({
            description: "There was an error while updating dispkay status !",
          });
        }
      }
    } catch (error) {}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[100px]">
        <DropdownMenuItem>
          <Link href={`/profile/profileSetting/product/${product.productId}`}>
            Update
          </Link>
        </DropdownMenuItem>
        {product.isDisplay === "true" ? (
          <DropdownMenuItem onClick={() => updateDisplay("false")}>
            Hide
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => updateDisplay("true")}>
            Display
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
