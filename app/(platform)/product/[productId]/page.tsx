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

interface ProductDetailPageProps {
  params: { productId: string };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const [product, setProduct] = useState<Product>();
  const [creator, setCreator] = useState<Account>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sesson = useSession();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(!isLoading);
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [params.productId]);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col space-y-6 mb-10">
        <ProductInformationDetail
          creator={creator}
          product={product}
          isLoading={isLoading}
        />
        <RatingSection product={product} isLoading={isLoading} />
        <CommentSection isLoading={isLoading} product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
