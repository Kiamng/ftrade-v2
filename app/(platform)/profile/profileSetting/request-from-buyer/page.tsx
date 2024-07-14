"use client";

import { getUserById } from "@/app/api/account/account.api";
import {
  getProductById,
  updateProductStatus,
} from "@/app/api/product/product.api";
import {
  getAllRequest,
  updateRequest,
  updateRequestStatus,
} from "@/app/api/request-history/request-history.api";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import {
  Request,
  RequestForm,
  RequestListInfor,
  requestTableData,
} from "@/types/request";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "../_components/header";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
const RequestFormBuyerPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [requestDataList, setRequestDataList] = useState<requestTableData[]>(
    []
  );
  const [isPending, setIsPending] = useState<boolean>(false);
  const [requestListInfor, setRequestListInfor] = useState<RequestListInfor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();
  const [requestValue, setRequestValue] = useState<RequestForm>();

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllRequest({
          token: session.data?.user?.token as string,
          SellerId: session.data?.user?.accountId as string,
          PageNumber: 1,
          PageSize: 10,
        });
        setRequestListInfor(response);
        const requestDataPromises = response.items.map(async (request) => {
          const productSeller = await getProductById(
            request.productSellerId,
            session.data?.user?.token as string
          );
          const seller = await getUserById(
            request.sellerId,
            session.data?.user?.token as string
          );
          const requestsByProduct = await response.items.map(
            async (request) => {
              const buyer = await getUserById(
                request.buyerId,
                session.data?.user?.token as string
              );
              let productBuyer: Product | null = null;
              if (request.productBuyerId) {
                productBuyer = await getProductById(
                  request.productBuyerId,
                  session.data?.user?.token as string
                );
              }
              const id = request.id;
              return {
                requestId: id,
                buyer: buyer,
                productBuyer: productBuyer,
              };
            }
          );

          return {
            seller: seller,
            productSeller: productSeller,
            listProductByRequest: await Promise.all(requestsByProduct),
            createdDate: request.createdDate,
            status: request.status,
          };
        });

        const requestDataList = await Promise.all(requestDataPromises);
        console.log(requestDataList);

        setRequestDataList(requestDataList);
      } catch (error) {
        toast({
          description: `There was an error fetching the requests.`,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequestData();
  }, [session.data?.user?.accountId, session.data?.user?.token]);

  const handleUpdateRequest = async (value: Request) => {
    try {
      setIsPending(true);
      const response = await updateRequestStatus(
        value.id,
        "InExchange",
        session.data?.user?.token as string
      );
      const updateProduct = await updateProductStatus(
        value.productSellerId,
        session.data?.user?.token as string,
        "",
        "InExchange",
        "true"
      );
      toast({
        description: `Updated request successfully`,
      });
      window.location.reload();
    } catch (error) {
      toast({
        description: "There was an error while processing your request !",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return "is loading";
  }

  return (
    <div className="w-full space-y-4">
      <Header title="Request from buyer" />
      <Separator />

      {!requestDataList
        ? "no data"
        : requestDataList.map((product) => (
            <Collapsible
              key={product.productSeller.productId}
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-full space-y-2"
            >
              <div className="flex items-center justify-between space-x-4 p-4 border rounded-2xl hover:shadow-lg">
                <div className="flex justify-start items-start space-x-2">
                  <div className="w-[150px] h-[150px] ">
                    <img
                      alt="product img"
                      src={product.productSeller.imagePro}
                      height={0}
                      width={0}
                      className="w-full h-full object-cover"
                    ></img>
                  </div>
                  <div className="flex flex-col">
                    <Link href={`/product/${product.productSeller.productId}`}>
                      <Button variant={"link"} className="text-xl font-medium">
                        {product.productSeller.title}
                      </Button>
                    </Link>
                    <div className="ml-4">
                      <h4 className="text-base font-medium">
                        Category:{" "}
                        <span className="font-normal">
                          {product.productSeller.category.name}
                        </span>
                      </h4>
                      <h4 className="text-base font-medium">
                        Genre:{" "}
                        <span className="font-normal">
                          {product.productSeller.genre.name}
                        </span>
                      </h4>
                      <h4 className="text-base font-medium">
                        Campus:{" "}
                        <span className="font-normal">
                          {product.productSeller.city.name}
                        </span>
                      </h4>
                      <h4 className="text-base font-medium">
                        Created date:{" "}
                        <span className="font-normal">
                          {format(
                            product.productSeller.createdDate,
                            "HH:mm dd/MM/yyyy"
                          )}
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2  w-full ">
                {product.listProductByRequest.map((request) => {
                  const thisRequest = requestListInfor?.items.find(
                    (items) =>
                      items.productBuyerId === request.productBuyer?.productId
                  );

                  return (
                    <div
                      key={request.requestId}
                      className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center"
                    >
                      <div>{request.buyer.userName}</div>
                      <div className="flex  items-center ">
                        <div className="w-[70px] h-[50px] ">
                          {request.productBuyer && (
                            <img
                              src={request.productBuyer.imagePro}
                              height={0}
                              width={0}
                              alt={"product img"}
                              className="h-full w-full object-fill"
                            ></img>
                          )}
                        </div>
                        <Link
                          href={`product/${request.productBuyer?.productId}`}
                        >
                          <Button variant={"link"}>
                            {request.productBuyer?.title}
                          </Button>
                        </Link>
                      </div>
                      <Badge>{thisRequest?.status}</Badge>
                      <div>
                        <span className="underline">Request at:</span>{" "}
                        {format(
                          thisRequest?.createdDate as Date,
                          "HH:mm dd/MM/yyyy"
                        )}
                      </div>
                      {product.status === "Pending" ? (
                        <Button
                          onClick={() => handleUpdateRequest(thisRequest!)}
                        >
                          Accept
                        </Button>
                      ) : thisRequest?.status === "InExchange" ? (
                        <Button disabled={true}>Accepted</Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
      <Separator />
    </div>
  );
};
export default RequestFormBuyerPage;
