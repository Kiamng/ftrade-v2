"use client";
import { Separator } from "@/components/ui/separator";
import { Header } from "../_components/header";
import { OrderList, OrderListInfor } from "@/types/order";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAllOrder } from "@/app/api/order/order.api";
import { getOrderDetailByOrderId } from "@/app/api/order-detail/order-detail.api";
import Link from "next/link";
import { format } from "date-fns";

const OrderHistoryPage = () => {
  const session = useSession();

  const sortByValue = {
    totalPrice: "totalprice",
    orderDate: "orderdate",
  };

  const [orderList, setOrderList] = useState<OrderListInfor>();
  const [orderDetail, setOrderDetail] = useState<OrderList[]>();

  const [sortBy, setSortBy] = useState<string>(sortByValue.orderDate);
  const [status, setStatus] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getAllOrder({
          token: session.data?.user?.token as string,
          CustomerId: session.data?.user?.accountId as string,
          PageNumber: currentPage,
          PageSize: 5,
          SortAscending: sortAscending,
          SortBy: sortBy,
          Status: status ? status : "",
        });
        setOrderList(response);
        const newOrderData: OrderList[] = await Promise.all(
          response.items.map(async (item) => {
            const orderDetailData = await getOrderDetailByOrderId(
              item.orderId,
              session.data?.user?.token as string
            );

            return {
              order: item,
              detail: orderDetailData,
            };
          })
        );
        console.log(newOrderData);

        setOrderDetail(newOrderData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrder();
  }, [filter === true]);

  if (isLoading) {
    return "is loading ...";
  }

  return (
    <div className="w-full p-8 space-y-4">
      <Header title={`Order history(${orderList?.totalItem})`} />
      <Separator />
      {orderDetail?.map((order) => (
        <div
          key={order.order.orderId}
          className="flex flex-col mx-auto w-[700px] p-4 border rounded-lg space-y-4"
        >
          <div className="w-full flex justify-between">
            <div className="flex space-x-2">
              <div className="w-[70px] h-[80px]">
                <img
                  src={order.detail[0].product.imagePro}
                  width={0}
                  height={0}
                  alt={"image"}
                  className="w-full h-full object-cover"
                ></img>
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  {order.detail[0].product.title}
                </p>
                <p className="text-lg font-semibold">
                  {order.detail[0].product.price.toLocaleString()}VND
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-base font-semibold">
                Status: {order.order.status}
              </p>
              <p className="text-base font-semibold">
                Total price: {order.order.totalPrice.toLocaleString()}
              </p>
              <p className="text-base font-semibold">
                Order date : {format(order.order.orderDate, "HH:mm dd/MM/yyyy")}
              </p>
            </div>
          </div>
          <Separator />
          <div className="w-full text-center">
            <Link
              href={`/profile/profileSetting/order-history/${order.order.orderId}`}
            >
              View more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
export default OrderHistoryPage;
