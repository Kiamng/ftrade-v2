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

interface RatingSectionProp {
  product: Product | undefined;
  isLoading: boolean;
}

const RatingSection = ({ product, isLoading }: RatingSectionProp) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[500px] rounded-2xl" />;
  }
  if (!product?.rated) {
    return (
      <div className="rated-secttion w-full flex flex-col border-2 rounded-2xl shadow-lg">
        <div className="w-full border-b text-2xl font-medium p-4">
          Rating section ({product?.ratedCount ? product?.ratedCount : 0})
        </div>
        <div className="w-full text-xl text-slate-400 font-normal p-4">
          This product has no ratings yet
        </div>
      </div>
    );
  }
  return (
    <div className="rated-secttion w-full flex flex-col border-2 rounded-2xl shadow-lg">
      <div className="w-full border-b text-2xl font-medium p-4">
        Rating section ({product?.ratedCount ? product?.ratedCount : 0})
      </div>
      <div className=" flex justify-evenly border-b">
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
        <div>
          <Progress value={33} className="w-full" />
        </div>
      </div>
      <div className="rating-list w-full flex flex-col">
        <div className=" flex items-start m-4 border-b pb-4">
          <Image
            src={defaultUserImg}
            alt="user Avatar"
            width={36}
            height={36}
            className="rounded-full object-fill"
          ></Image>
          <div className="w-full ml-3 space-y-2">
            <div>
              <Link href={"#"} className="hover:underline text-lg font-medium">
                quoclam
              </Link>
              <p>wow this product is amazing</p>
            </div>
            <div className="flex space-x-1">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    color={index + 1 <= product?.rated! ? "yellow" : "gray"}
                  />
                );
              })}
            </div>
            <p className="text-sm text-slate-400"> date-date-date</p>
          </div>
        </div>
        <div className=" flex items-start m-4 border-b pb-4">
          <Image
            src={defaultUserImg}
            alt="user Avatar"
            width={36}
            height={36}
            className="rounded-full object-fill"
          ></Image>
          <div className="w-full ml-3 space-y-2">
            <div>
              <Link href={"#"} className="hover:underline text-lg font-medium">
                minhPhuc
              </Link>
              <p>wow this product is amazing</p>
            </div>

            <div className="flex space-x-1">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    color={index + 1 <= product?.rated! ? "yellow" : "gray"}
                  />
                );
              })}
            </div>
            <p className="text-sm text-slate-400"> date-date-date</p>
          </div>
        </div>
        <div className=" flex items-start m-4 border-b pb-4">
          <Image
            src={defaultUserImg}
            alt="user Avatar"
            width={36}
            height={36}
            className="rounded-full object-fill"
          ></Image>
          <div className="w-full ml-3 space-y-2">
            <div>
              <Link href={"#"} className="hover:underline text-lg font-medium">
                hoangPhuc
              </Link>
              <p>wow this product is amazing</p>
            </div>

            <div className="flex space-x-1">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    color={index + 1 <= product?.rated! ? "yellow" : "gray"}
                  />
                );
              })}
            </div>
            <p className="text-sm text-slate-400"> date-date-date</p>
          </div>
        </div>
        <div className=" flex items-start m-4 border-b pb-4">
          <Image
            src={defaultUserImg}
            alt="user Avatar"
            width={36}
            height={36}
            className="rounded-full object-fill"
          ></Image>
          <div className="w-full ml-3 space-y-2">
            <div>
              <Link href={"#"} className="hover:underline text-lg font-medium">
                duyTruong
              </Link>
              <p>wow this product is amazing</p>
            </div>

            <div className="flex space-x-1">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    color={index + 1 <= product?.rated! ? "yellow" : "gray"}
                  />
                );
              })}
            </div>
            <p className="text-sm text-slate-400"> date-date-date</p>
          </div>
        </div>
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
  );
};
export default RatingSection;
