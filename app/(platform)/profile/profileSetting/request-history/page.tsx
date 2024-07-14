"use client";
import { Separator } from "@/components/ui/separator";
import { Header } from "../_components/header";
import { useEffect, useState } from "react";
import {
  RequestListInfor,
  requestTableData,
  yourRequest,
} from "@/types/request";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { getAllRequest } from "@/app/api/request-history/request-history.api";
import { getProductById } from "@/app/api/product/product.api";
import { getUserById } from "@/app/api/account/account.api";
import { Product } from "@/types/product";
import { DataTable } from "@/components/data-table";
import { requestHistoryColumns } from "./_components/columns";
const RequestHistoryPage = () => {
  const [requestDataList, setRequestDataList] = useState<yourRequest[]>([]);
  const [requestListInfor, setRequestListInfor] = useState<RequestListInfor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllRequest({
          token: session.data?.user?.token as string,
          BuyerId: session.data?.user?.accountId as string,
          PageNumber: 1,
          PageSize: 10,
        });

        const requestDataPromises = response.items.map(async (request) => {
          const productSeller = await getProductById(
            request.productSellerId,
            session.data?.user?.token as string
          );
          const buyer = await getUserById(
            request.buyerId,
            session.data?.user?.token as string
          );
          const seller = await getUserById(
            request.sellerId,
            session.data?.user?.token as string
          );
          let productBuyer: Product | null = null;
          if (request.productBuyerId) {
            productBuyer = await getProductById(
              request.productBuyerId,
              session.data?.user?.token as string
            );
          }

          return {
            requestId: request.id,
            seller: seller,
            buyer: buyer,
            productBuyer: productBuyer,
            productSeller: productSeller,
            createdDate: request.createdDate,
            status: request.status,
          };
        });

        const requestDataList = await Promise.all(requestDataPromises);

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
  if (isLoading) {
    return "is Loading";
  }
  return (
    <div className="w-full space-y-4">
      <Header title="Request history" />
      <Separator />
      <DataTable columns={requestHistoryColumns} data={requestDataList} />
    </div>
  );
};
export default RequestHistoryPage;
