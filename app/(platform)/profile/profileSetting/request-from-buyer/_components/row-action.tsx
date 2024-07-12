"use client";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import { requestSchema } from "@/data/schema";
import { updateRequest } from "@/app/api/request-history/request-history.api";
import { RequestForm } from "@/types/request";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function RequestRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const session = useSession();
  const request = requestSchema.parse(row.original);
  const submitValue: RequestForm = {
    buyerId: request.buyer.accountId,
    productBuyerId: "",
    productSellerId: request.productSeller.productId,
    sellerId: request.productSeller.creatorId,
    status: request.status,
  };
  const handleUpdateRequest = async () => {
    try {
      setIsPending(true);
      const response = await updateRequest(
        request.requestId,
        { ...submitValue, status: "Processing" },
        session.data?.user?.token as string
      );
      toast.success("Updated successfully !");
      window.location.reload();
    } catch (error) {
      toast.error("There was an error while processing your request !");
    } finally {
      setIsPending(false);
    }
  };
  if (request.status === "Pending") {
    return <Button onClick={handleUpdateRequest}>Accept</Button>;
  }
  if (isPending) {
    return (
      <Button type="submit" disabled={isPending}>
        <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
        Creating
      </Button>
    );
  }
  return <Button disabled={true}>Accepted</Button>;
}
