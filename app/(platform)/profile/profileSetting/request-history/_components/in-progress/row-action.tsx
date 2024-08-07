"use client";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import { requestSchema } from "@/data/schema";
import {
  deleteRequest,
  updateRequest,
} from "@/app/api/request-history/request-history.api";
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
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function RequestHistoryRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  const handleUpdateRequest = async () => {
    try {
      setIsPending(true);
      const updateSellerProductStatus = await updateProductStatus(
        request.productSeller.productId,
        session.data?.user?.token as string,
        "",
        "SoldOut",
        "true"
      );
      // console.log("updateSellerProductStatus :", updateSellerProductStatus);

      if (request.productBuyer) {
        const updateBuyerProductStatus = await updateProductStatus(
          request.productBuyer.productId,
          session.data?.user?.token as string,
          "",
          "SoldOut",
          "true"
        );
        // console.log("updateBuyerProductStatus: ", updateBuyerProductStatus);
      }
      const response = await updateRequest(
        request.requestId,
        { ...submitValue, status: "Done" },
        session.data?.user?.token as string
      );
      const rateResponse = await rateProduct(
        rateValue,
        session.data?.user?.token as string
      );
      console.log("rateResponse:", rateResponse);

      toast.success("Rated successfully !");
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
      // window.location.reload();
    }
  };
  const hanldeDeleteRequest = async () => {
    try {
      if (request.status === "InExchange") {
        toast.error("This product is in exchange");
        return;
      } else {
        setIsPending(true);
        const response = deleteRequest(
          request.requestId,
          session.data?.user?.token as string
        );
        if (request.productBuyer) {
          const updateBuyerProductStatus = await updateProductStatus(
            request.productBuyer.productId,
            session.data?.user?.token as string,
            "",
            "Approved",
            "true"
          );
        }
        toast.success("Unrequest successfully");
        window.location.reload();
      }
    } catch (error) {
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {request.status === "InExchange" ? (
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
      ) : (
        <></>
      )}
      {request.status !== "Done" && (
        <Button
          onClick={hanldeDeleteRequest}
          disabled={request.status === "InExchange"}
        >
          Cancel
        </Button>
      )}
    </div>
  );

  if (isPending) {
    return (
      <Button type="submit" disabled={isPending}>
        <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
        Processing
      </Button>
    );
  }
}
