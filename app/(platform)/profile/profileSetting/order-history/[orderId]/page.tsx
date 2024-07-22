"use client";

import { Order } from "@/types/order";
import { OrderDetail } from "@/types/order-detail";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrderById } from "@/app/api/order/order.api";
import { useSession } from "next-auth/react";
import { getOrderDetailByOrderId } from "@/app/api/order-detail/order-detail.api";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/custom/button";
import { CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
interface OrderViewMorePageProps {
  params: { orderId: string };
}
const OrderViewMorePage = ({ params }: OrderViewMorePageProps) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);
  const [order, SetOrder] = useState<Order>();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const Order = await getOrderById(
          params.orderId,
          session.data?.user?.token as string
        );
        SetOrder(Order);
        const OrderDetailList = await getOrderDetailByOrderId(
          params.orderId,
          session.data?.user?.token as string
        );
        setOrderDetail(OrderDetailList);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.orderId]);
  const orderDate = order?.orderDate ? new Date(order.orderDate) : null;

  const formattedDate = orderDate
    ? format(orderDate, "HH:mm dd/MM/yyyy")
    : "Invalid date";
  if (isLoading) {
    return "is loading ...";
  }
  return (
    <div>
      <Button onClick={() => router.back()} className="space-x-2">
        {" "}
        <CornerDownLeft /> <span>Go back</span>
      </Button>
      <div className="w-full flex justify-center">
        <Card className="w-[600px] space-y-4">
          <CardHeader>
            <CardTitle>Order detail</CardTitle>
            <CardDescription>Information</CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            {orderDetail.map((items, index) => (
              <div key={index} className="w-full flex space-x-2">
                <div className="w-[60px] h-[70px]">
                  <img
                    src={items.product.imagePro}
                    alt="img"
                    height={0}
                    width={0}
                    className="w-full h-full object-cover"
                  ></img>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-medium">{items.product.title}</p>
                  <p className="text-lg font-medium">{items.price}</p>
                  <p className="text-lg font-medium">{items.quantity}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col">
            <p className="text-base font-semibold">Status: {order?.status}</p>
            <p className="text-base font-semibold">
              Total price: {order?.totalPrice.toLocaleString()}
            </p>
            <p className="text-base font-semibold">
              Order date : {formattedDate}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default OrderViewMorePage;
