"use client";
import { getUserById } from "@/app/api/account/account.api";
import { getProductById } from "@/app/api/product/product.api";
import { getAllRate } from "@/app/api/rate/rate.api";
import { getAllRequest } from "@/app/api/request-history/request-history.api";
import { DataTable } from "@/components/data-table";
import { Product } from "@/types/product";
import { doneRequestData } from "@/types/request";
import { useEffect, useState } from "react";
import { userDoneRequestHistoryColumns } from "./done-columns";

interface DoneRequestPageProps {
  token: string;
  userId: string;
}

const UserDoneRequestPage = ({ token, userId }: DoneRequestPageProps) => {
  const [userDoneRequests, setUserDoneRequests] = useState<doneRequestData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchDoneRequestList = async () => {
      try {
        setIsLoading(true);
        const doneRequestList = await getAllRequest({
          token: token,
          BuyerId: userId,
          status: "Done",
          PageNumber: 1,
          PageSize: 5,
          SortBy: "createdDate",
          SortAscending: false,
        });

        const transformedRequests = await Promise.all(
          doneRequestList.items.map(async (request) => {
            const rateOfProduct = await getAllRate(
              request.productSellerId,
              token
            );
            const productSeller = await getProductById(
              request.productSellerId,
              token
            );
            let productBuyer: Product | null = null;
            if (request.productBuyerId) {
              productBuyer = await getProductById(
                request.productBuyerId,
                token
              );
            }
            const buyer = await getUserById(request.buyerId, token);
            const seller = await getUserById(request.sellerId, token);

            return {
              requestId: request.id,
              seller,
              buyer,
              productBuyer,
              productSeller,
              createdDate: request.createdDate,
              rate: rateOfProduct.items[0],
            };
          })
        );

        setUserDoneRequests(transformedRequests);
        console.log(transformedRequests);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoneRequestList();
  }, [token, userId]);

  if (isLoading) {
    return "Is loading ... ";
  }
  return (
    <div className="w-full">
      <DataTable
        columns={userDoneRequestHistoryColumns}
        data={userDoneRequests}
      />
    </div>
  );
};
export default UserDoneRequestPage;
