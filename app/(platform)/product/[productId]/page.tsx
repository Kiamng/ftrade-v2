"use client";
import { getProductById } from "@/app/api/product/product.api";
import { Product } from "@/types/product";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultimg from "@/assets/img/product/default-img.webp";
import React from "react";
import defaultUserImg from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";
import { getUserById } from "@/app/api/account/account.api";
import { Account } from "@/types/account";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingSection from "../_components/rating-section";
import { Textarea } from "@/components/ui/textarea";
import CommentSection from "../_components/comment-section";

interface ProductDetailPageProps {
  params: { productId: string };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const [product, setProduct] = useState<Product>();
  const [creator, setCreator] = useState<Account>();
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await getProductById(params.productId);
        setProduct(response);
        const user = await getUserById(response.creatorId as string);
        setCreator(user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getProduct();
  }, []);

  console.log(creator);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col space-y-6 mb-10">
        <div className="flex w-full justify-between border-b py-4">
          <h2 className="text-3xl font-semibold ">{product?.title}</h2>
          <div className="flex space-x-2 items-center">
            <p className="text-sm">
              {product?.ratedCount ? product.ratedCount : 0} Rated
            </p>
            <p className="text-sm">
              {product?.commentCount ? product.commentCount : 0} Comments
            </p>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="h-full">
            <Image
              src={defaultimg}
              alt="image"
              width={585}
              height={390}
              className="object-cover rounded-2xl"
            ></Image>
          </div>
          <div className="information w-[585px]  space-y-3">
            <div className="border-b pb-4 flex w-full items-center">
              <Image
                src={creator?.avatarUrl ? creator?.avatarUrl : defaultUserImg}
                alt="user Avatar"
                width={36}
                height={36}
                className="rounded-full object-fill"
              ></Image>
              <Link href={"#"}>
                <Button variant="link" className="text-xl font-medium">
                  {creator?.userName}
                </Button>
              </Link>
            </div>
            <div className="flex w-full justify-between">
              <Badge className="text-2xl font-normal">
                {product?.price === 0 ? "Free" : `${product?.price} VND`}
              </Badge>
              <Badge className="text-2xl font-normal">
                {product?.genre.name}
              </Badge>
            </div>
            <div className="w-full bg-slate-100 rounded-2xl min-h-[275px] p-4 space-y-2">
              <div className="w-full border-b grid grid-cols-2 gap-0 h-[70px]">
                <p className="font-semibold">
                  Category :
                  <span className="font-normal"> {product?.category.name}</span>
                </p>
                <p className="font-semibold">
                  Campus :
                  <span className="font-normal"> {product?.city.name}</span>
                </p>
                <p className="font-semibold">
                  Quantity :
                  <span className="font-normal"> {product?.quantity}</span>
                </p>
              </div>
              <div className="w-full font-semibold">
                Description :{" "}
                <span className="font-normal"> {product?.description}</span>
              </div>
            </div>
            <Button className="w-full">Request</Button>
          </div>
        </div>
        <RatingSection product={product as Product} />
        <CommentSection />
      </div>
    </div>
  );
};

export default ProductDetailPage;
