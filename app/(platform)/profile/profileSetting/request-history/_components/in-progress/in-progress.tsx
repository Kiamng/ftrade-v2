"use client";

import { getUserById } from "@/app/api/account/account.api";
import { getProductById } from "@/app/api/product/product.api";
import { getAllRequest } from "@/app/api/request-history/request-history.api";
import { DataTable } from "@/components/data-table";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { yourRequest } from "@/types/request";
import { useEffect, useState } from "react";
import { requestHistoryColumns } from "./columns";

interface UserInProgressRequestProps {
  token: string;
  userId: string;
}

const UserInProgressRequest = ({
  token,
  userId,
}: UserInProgressRequestProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [requestDataList, setRequestDataList] = useState<yourRequest[]>([]);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllRequest({
          token: token,
          BuyerId: userId,
          PageNumber: 1,
          PageSize: 10,
        });

        const requestDataPromises = response.items
          .filter((request) => request.status !== "Done")
          .map(async (request) => {
            const productSeller = await getProductById(
              request.productSellerId,
              token
            );
            const buyer = await getUserById(request.buyerId, token);
            const seller = await getUserById(request.sellerId, token);
            let productBuyer: Product | null = null;
            if (request.productBuyerId) {
              productBuyer = await getProductById(
                request.productBuyerId,
                token
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
  }, [token, userId]);
  if (isLoading) {
    return "is Loading";
  }
  return <DataTable columns={requestHistoryColumns} data={requestDataList} />;
};
export default UserInProgressRequest;
