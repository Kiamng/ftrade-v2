"use client";
import { getAllProduct, getProductById } from "@/app/api/product/product.api";
import { Product, ProductList } from "@/types/product";
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
  const [product, setProduct] = useState<Product>();
  const [creator, setCreator] = useState<Account>();
  const [rate, setRate] = useState<RateListInfor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRates, setUserRates] = useState<userRate[]>([]);
  const sesson = useSession();
  const [requestHistory, setRequestHistory] = useState<RequestListInfor>();
  const [userProductList, setUserProductList] = useState<ProductList>();
  const [open, setIsOpen] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchUserProduct = async () => {
      const response = await getAllProduct({
        token: sesson.data?.user?.token as string as string,
        creatorId: sesson.data?.user?.accountId as string,
        isDisplay: "true",
        status: "Approved",
      });
      setUserProductList(response);
    };
    fetchUserProduct();
  });

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col space-y-6 mb-10">
        <ProductInformationDetail
          creator={creator}
          product={product}
          isLoading={isLoading}
          userId={sesson.data?.user?.accountId}
          requestHistory={requestHistory}
          token={sesson.data?.user?.token as string}
          userProductList={userProductList}
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
