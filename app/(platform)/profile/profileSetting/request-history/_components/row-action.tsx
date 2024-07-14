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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { FaStar } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Rate, RateForm } from "@/types/rate";
import { rateProduct } from "@/app/api/rate/rate.api";
import { updateProductStatus } from "@/app/api/product/product.api";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function RequestHistoryRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [rateColor, setRateColor] = useState<any>();
  const [inputValue, setInputValue] = useState<string>("");
  const session = useSession();
  const request = requestSchema.parse(row.original);
  const submitValue: RequestForm = {
    buyerId: request.buyer.accountId,
    productBuyerId: request.productBuyer?.productId,
    productSellerId: request.productSeller.productId,
    sellerId: request.productSeller.creatorId,
    status: request.status,
  };

  const rateValue: RateForm = {
    customerId: request.buyer.accountId,
    descript: inputValue,
    productId: request.productSeller.productId,
    rated: rating,
  };
  console.log(request.productSeller);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  const handleUpdateRequest = async () => {
    try {
      setIsPending(true);
      const response = await updateRequest(
        request.requestId,
        { ...submitValue, status: "Done" },
        session.data?.user?.token as string
      );
      const rateResponse = await rateProduct(
        rateValue,
        session.data?.user?.token as string
      );
      console.log("arrived");
      const updateSellerProductStatus = await updateProductStatus(
        request.productSeller.productId,
        session.data?.user?.token as string,
        "",
        "Approved",
        "true"
      );
      console.log("processed");
      if (request.productBuyer) {
        const updateBuyerProductStatus = await updateProductStatus(
          request.productBuyer.productId,
          session.data?.user?.token as string,
          "",
          "Approved",
          "true"
        );
        console.log("done");
      }

      toast.success("Rated successfully !");
      window.location.reload();
    } catch (error) {
      //   toast.error("There was an error while processing your request !");
    } finally {
      setIsPending(false);
      window.location.reload();
    }
  };
  if (request.status === "InExchange") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Done</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Let rate the product and seller !
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col w-full justify-center my-4 space-y-4">
              <label className="flex space-x-2 w-full justify-center">
                {[...Array(5)].map((star, index) => {
                  const currentRate = index + 1;
                  return (
                    <>
                      <FaStar
                        onClick={() => setRating(currentRate)}
                        size={25}
                        color={
                          currentRate <= (rateColor || rating)
                            ? "yellow"
                            : "grey"
                        }
                      />
                    </>
                  );
                })}
              </label>

              <Textarea
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Write your review here..."
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              disabled={rating === 0 || inputValue === ""}
              onClick={handleUpdateRequest}
            >
              Rate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (isPending) {
    return (
      <Button type="submit" disabled={isPending}>
        <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
        Processing
      </Button>
    );
  }
}
