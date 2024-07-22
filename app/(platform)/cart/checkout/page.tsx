"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/cart-context";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { createOrder } from "@/app/api/order/order.api";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { createOrderDetail } from "@/app/api/order-detail/order-detail.api";
import { createPayment } from "@/app/api/payment/payment.api";

const CheckOutPage = () => {
  const session = useSession();
  const {
    cartItems,
    calculateSubtotal,
    calculateTotal,
    removeItem,
    clearCart,
    removeCart,
  } = useCart();
  const subtotal = useMemo(() => calculateSubtotal(), [cartItems]);
  const total = useMemo(() => calculateTotal(), [subtotal]);
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const handlePlacingOrder = async () => {
    try {
      setIsPending(true);
      const createOrderResponse = await createOrder(
        session.data?.user?.accountId as string,
        total,
        session.data?.user?.token as string
      );
      if (createOrderResponse.status === 200) {
        cartItems.map(async (items) => {
          const formData = {
            productId: items.productId,
            productName: items.title,
            quantity: items.cartQuantity,
            price: items.price,
          };
          const createOrderDetailResponse = await createOrderDetail(
            createOrderResponse.data.order as string,
            formData,
            session.data?.user?.token as string
          );
        });
        const VNPay = await createPayment(
          createOrderResponse.data.order as string,
          total,
          session.data?.user?.token as string
        );
        removeCart();
        window.location.href = VNPay.data;
      } else {
        toast({ description: "Failed to create order!" });
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="max-h-[700px] overflow-y-auto">
      <Button onClick={() => router.back()} className="space-x-2 mt-4 ml-4">
        <CornerDownLeft /> <span>Go back</span>
      </Button>
      <div className="w-full flex justify-center  p-8">
        <div className="w-[50%] border rounded-xl">
          <div className="w-full p-4">
            <h2 className="text-xl font-bold text-center">Checkout</h2>
          </div>
          <Separator />
          <Table className="border">
            <TableHeader className="">
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[120px]">Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems &&
                cartItems.map(async (item) => {
                  return (
                    <TableRow key={item.productId}>
                      <TableCell className="w-[50px] h-[70px]">
                        <img
                          className="w-full h-full object-cover"
                          height={0}
                          width={0}
                          alt={item.title}
                          src={item.imagePro}
                        ></img>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Link href={`/profile/${item.creatorId}`}>
                          {item.creatorName}
                        </Link>
                      </TableCell>
                      <TableCell>{item.price.toLocaleString()}</TableCell>
                      <TableCell>{item.cartQuantity}</TableCell>
                      <TableCell>
                        {(item.price * item.cartQuantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-end space-x-2" colSpan={7}>
                  <span>Total:</span>
                  <span className="font-bold">
                    {total.toLocaleString()} VND
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="w-full flex justify-end my-4 p-4">
            <Button disabled={isPending} onClick={handlePlacingOrder}>
              {isPending ? (
                <>
                  <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Placing order ...
                </>
              ) : (
                "Place order"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckOutPage;
