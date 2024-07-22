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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createRequest } from "@/app/api/request-history/request-history.api";
import { RequestForm, RequestListInfor } from "@/types/request";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  getAllProduct,
  updateProductStatus,
} from "@/app/api/product/product.api";
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
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { CartItems, useCart } from "../../cart/context/cart-context";
interface ProductInformationDetailProps {
  product: Product | undefined;
  creator: Account | undefined;
  userId: string | undefined;
  isLoading: boolean;
  requestHistory: RequestListInfor | undefined;
  token: string;
  userProductList: ProductList | undefined;
  hanldeDeleteRequest: (requestId: string) => Promise<void>;
}

const ProductInformationDetail = ({
  product,
  creator,
  userId,
  isLoading,
  requestHistory,
  token,
  userProductList,
  hanldeDeleteRequest,
}: ProductInformationDetailProps) => {
  const cart = useCart();

  const [isPending, setIsPending] = useState<boolean>(false);

  const [productBuyerId, setProductBuyerId] = useState<string>("");
  const router = useRouter();
  const thisRequest = requestHistory?.items.find(
    (items) => items.buyerId === userId && items.status === "PendingExchange"
  );

  const requestValue: RequestForm = {
    buyerId: userId as string,
    productBuyerId: productBuyerId,
    productSellerId: product?.productId as string,
    sellerId: creator?.accountId as string,
    status: "PendingExchange",
  };
  const { toast } = useToast();

  const hanldeCreateRequest = async () => {
    try {
      setIsPending(true);
      const response = await createRequest(requestValue, token);
      if (productBuyerId) {
        const updateProduct = await updateProductStatus(
          requestValue.productBuyerId as string,
          token,
          "",
          "PendingExchange",
          "true"
        );
      }

      if (response === 200) {
        toast({
          description: `Your request is created susccessfully ✓ `,
        });
        router.push(`/product/${product?.productId}`);
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

  const handleAddToCart = () => {
    const checkCart = cart.cartItems.find(
      (item) => item.productId === product?.productId
    );
    if (checkCart) {
      if (checkCart.cartQuantity === product?.quantity) {
        toast({
          description: "You reached max quantity of this product",
          variant: "destructive",
        });
      }
      return;
    } else if (product?.productId && creator?.userName) {
      const productWithCartQuantity = {
        ...product,
        cartQuantity: 1,
        creatorName: creator?.userName,
      };
      cart.addToCart(productWithCartQuantity);
      toast({ description: "Product added to cart!" });
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
      </div>
      <Separator />
      <div className="flex space-x-6 mt-4">
        <div className="h-[390px] w-[585px]">
          <img
            src={product?.imagePro ? product?.imagePro : defaultimg.src}
            alt="image"
            width={0}
            height={0}
            className="object-cover rounded-2xl w-full h-full"
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
            {product?.genre.name === "Sell" && (
              <Badge className="text-2xl font-normal">
                {product?.price === 0
                  ? "Free"
                  : `${product?.price.toLocaleString()} VND`}
              </Badge>
            )}

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

          {product?.genre.name === "Sell" && userId !== creator?.accountId ? (
            <Button
              onClick={handleAddToCart}
              className="w-full space"
              variant={"outline"}
            >
              <span>Add to cart</span>
              <ShoppingCart size={"20"} />
            </Button>
          ) : (
            <></>
          )}
          {product?.genre.name !== "Sell" &&
            (product?.status === "SoldOut" ? (
              <Button
                disabled={true}
                className="w-full"
                variant={"destructive"}
              >
                Sold out
              </Button>
            ) : userId === creator?.accountId && product?.quantity! > 0 ? (
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
                Processing
              </Button>
            ) : thisRequest ? (
              <Button
                onClick={() => hanldeDeleteRequest(thisRequest?.id!)}
                className="w-full"
              >
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
                        {userProductList?.totalItem! > 0
                          ? userProductList?.items.map((product) => (
                              <label
                                key={product.productId}
                                className="w-full flex"
                              >
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
                                  onClick={() =>
                                    setProductBuyerId(product.productId)
                                  }
                                ></Input>
                              </label>
                            ))
                          : "You have no product that can be traded with the user product"}
                      </AlertDialogDescription>
                    )}
                  </AlertDialogHeader>
                  {userProductList?.totalItem! === 0 ? (
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={hanldeCreateRequest}>
                        Create
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  ) : (
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={hanldeCreateRequest}>
                        Create
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInformationDetail;
