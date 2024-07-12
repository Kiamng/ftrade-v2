"use client";
import { getProductById } from "@/app/api/product/product.api";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import React from "react";
import { getUserById } from "@/app/api/account/account.api";
import { Account } from "@/types/account";
import RatingSection from "../_components/rating-section";
import CommentSection from "../_components/comment-section";
import { useSession } from "next-auth/react";
import ProductInformationDetail from "../_components/product-information";
import {
  createRequest,
  getAllRequest,
} from "@/app/api/request-history/request-history.api";
import { RequestForm, RequestListInfor } from "@/types/request";
import { toast } from "@/components/ui/use-toast";
import { getAllRate } from "@/app/api/rate/rate.api";
import { Rate, RateListInfor, userRate } from "@/types/rate";

interface ProductDetailPageProps {
  params: { productId: string };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const [request, setRequest] = useState<RequestForm>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>();
  const [creator, setCreator] = useState<Account>();
  const [rate, setRate] = useState<RateListInfor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRates, setUserRates] = useState<userRate[]>([]);
  const sesson = useSession();
  const [requestHistory, setRequestHistory] = useState<RequestListInfor>();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(!isLoading);
        const requestHistory = await getAllRequest({
          token: sesson.data?.user?.token as string,
          BuyerId: sesson.data?.user?.accountId as string,
        });
        setRequestHistory(requestHistory);
        const response = await getProductById(
          params.productId,
          sesson.data?.user?.token as string
        );
        setProduct(response);
        const user = await getUserById(
          response.creatorId as string,
          sesson.data?.user?.token as string
        );
        setCreator(user);
        const rateResponse = await getAllRate(
          params.productId,
          sesson.data?.user?.token as string
        );
        setRate(rate);
        const userRatePromises = rateResponse.items.map(async (rate) => {
          const user = await getUserById(
            rate.customerId,
            sesson.data?.user?.token as string
          );
          return {
            user: user,
            rate: rate,
          };
        });

        const userRates = await Promise.all(userRatePromises);
        setUserRates(userRates);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [params.productId]);

  const hanldeCreateRequest = async () => {
    setRequest({
      buyerId: sesson.data?.user?.accountId as string,
      sellerId: creator?.accountId!,
      productSellerId: product?.productId!,
      productBuyerId: "",
      status: "Pending",
    });
    if (request) {
      try {
        setIsPending(true);
        const response = await createRequest(
          request,
          sesson.data?.user?.token as string
        );
        if (response === 200) {
          toast({
            description: `Your request is created susccessfully ✓ `,
          });
        } else {
          toast({
            description: `There has been an error while creating your request, please try again later !`,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: `Error : ${error} `,
          variant: "destructive",
        });
      } finally {
        setIsPending(false);
      }
    }
  };
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col space-y-6 mb-10">
        <ProductInformationDetail
          creator={creator}
          product={product}
          isLoading={isLoading}
          userId={sesson.data?.user?.accountId}
          hanldeCreateRequest={hanldeCreateRequest}
          isPending={isPending}
          requestHistory={requestHistory}
        />
        <RatingSection
          userRate={userRates}
          product={product}
          isLoading={isLoading}
        />
        <CommentSection isLoading={isLoading} product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
