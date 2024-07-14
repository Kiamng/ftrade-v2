"use client";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import defaultUserImg from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { userRate } from "@/types/rate";
import { Separator } from "@/components/ui/separator";

interface RatingSectionProp {
  product: Product | undefined;
  isLoading: boolean;
  userRate: userRate[] | undefined;
}

const RatingSection = ({ product, isLoading, userRate }: RatingSectionProp) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[500px] rounded-2xl" />;
  }
  return (
    <div className="rated-secttion w-full flex flex-col border-2 rounded-2xl shadow-lg">
      <div className="w-full border-b text-2xl font-medium p-4">
        Rating section ({product?.ratedCount ? product?.ratedCount : 0})
      </div>
      {product?.ratedCount === 0 || !product?.ratedCount ? (
        <div className="w-full text-xl text-slate-400 font-normal p-4">
          This product has no ratings yet,
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <div className="flex flex-col items-center space-y-2 py-4">
            <p className="font-normal">Average rating</p>
            <h1 className="text-4xl font-semibold">
              {product?.rated ? product?.rated : 0}/5
            </h1>
            <p className="flex space-x-1">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    color={index + 1 <= product?.rated! ? "yellow" : "gray"}
                  />
                );
              })}
            </p>
            <p className="text-sm text-slate-400">
              {product?.ratedCount ? product?.ratedCount : 0} ratings
            </p>
          </div>
          <Separator />
          <div className="rating-list w-full flex flex-col">
            {userRate?.map((rate) => (
              <div
                key={rate.rate.id}
                className=" flex items-start m-4 border-b pb-4"
              >
                <img
                  src={
                    rate.user.avatarUrl
                      ? rate.user.avatarUrl
                      : defaultUserImg.src
                  }
                  alt="user Avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-fill"
                ></img>
                <div className="w-full ml-3 space-y-2">
                  <div>
                    <Link
                      href={"#"}
                      className="hover:underline text-lg font-medium"
                    >
                      {rate.user.userName}
                    </Link>
                    <p>{rate.rate.descript}</p>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((star, index) => {
                      return (
                        <FaStar
                          key={index}
                          color={
                            index + 1 <= rate.rate.rated ? "yellow" : "gray"
                          }
                        />
                      );
                    })}
                  </div>
                  <p className="text-sm text-slate-400"> date-date-date</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagnition w-full mx-auto mb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1/3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
export default RatingSection;
