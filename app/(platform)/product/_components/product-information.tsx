"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Account } from "@/types/account";
import { Product, ProductList } from "@/types/product";
import Link from "next/link";
import defaultUserImg from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";
import defaultimg from "@/assets/img/product/default-img.webp";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import ProductInformationLoading from "./product-information-loading";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createRequest } from "@/app/api/request-history/request-history.api";
import { Request, RequestForm, RequestListInfor } from "@/types/request";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAllProduct } from "@/app/api/product/product.api";
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
interface ProductInformationDetailProps {
  product: Product | undefined;
  creator: Account | undefined;
  userId: string | undefined;
  isLoading: boolean;
  requestHistory: RequestListInfor | undefined;
  token: string;
  userProductList: ProductList | undefined;
}

const ProductInformationDetail = ({
  product,
  creator,
  userId,
  isLoading,
  requestHistory,
  token,
  userProductList,
}: ProductInformationDetailProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [request, setRequest] = useState<RequestForm>();
  const [requestLoading, setRequestLoading] = useState<boolean>(false);

  const [productBuyerId, setProductBuyerId] = useState<string>("");

  const requestValue: RequestForm = {
    buyerId: userId as string,
    productBuyerId: productBuyerId,
    productSellerId: product?.productId as string,
    sellerId: creator?.accountId as string,
    status: "Pending",
  };
  const { toast } = useToast();

  const hanldeCreateRequest = async () => {
    try {
      setIsPending(true);
      const response = await createRequest(requestValue, token);
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
  };

  const formattedDate = product?.createdDate
    ? format(product?.createdDate, "HH:mm dd/MM/yyyy")
    : "";

  if (isLoading) {
    return <ProductInformationLoading />;
  }

  return (
    <div>
      <div className="flex w-full justify-between py-4">
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
      <Separator />
      <div className="flex space-x-6 mt-4">
        <div className="h-full">
          <img
            src={product?.imagePro ? product?.imagePro : defaultimg.src}
            alt="image"
            width={585}
            height={390}
            className="object-cover rounded-2xl"
          ></img>
        </div>
        <div className="information w-[585px]  space-y-3">
          <div className=" pb-2 flex w-full items-center">
            <img
              src={creator?.avatarUrl ? creator?.avatarUrl : defaultUserImg.src}
              alt="user Avatar"
              width={36}
              height={36}
              className="rounded-full object-fill"
            ></img>
            <Link href={"#"}>
              <Button variant="link" className="text-xl font-medium">
                {creator?.userName}
              </Button>
            </Link>
          </div>
          <Separator />
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
              <p className="font-semibold">
                Created at :<span className="font-normal">{formattedDate}</span>
              </p>
            </div>
            <div className="w-full font-semibold">
              Description :
              <span className="font-normal"> {product?.description}</span>
            </div>
          </div>
          {userId === creator?.accountId ? (
            <></>
          ) : isPending ? (
            <Button
              className="w-full"
              type="submit"
              disabled={isPending}
              onClick={() => {
                toast;
              }}
            >
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              Requesting
            </Button>
          ) : requestHistory?.items.some(
              (items) => items.buyerId === userId
            ) ? (
            <Button disabled={true} className="w-full">
              Requested
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger className="w-full" asChild>
                <Button variant="outline">Request</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  {product?.genre.name === "Exchange" && (
                    <AlertDialogDescription className="overflow-hidden overflow-y-scroll max-h-[800px]">
                      {userProductList?.items.map((product) => (
                        <label key={product.productId} className="w-full flex">
                          <div className="w-full">
                            <img
                              src={product.imagePro}
                              height={0}
                              width={0}
                              className="w-full h-full object-cover"
                            ></img>
                          </div>
                          <span>{product.title}</span>
                          <Input
                            type="radio"
                            onClick={() => setProductBuyerId(product.productId)}
                          ></Input>
                        </label>
                      ))}
                    </AlertDialogDescription>
                  )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={hanldeCreateRequest}>
                    Create
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInformationDetail;
