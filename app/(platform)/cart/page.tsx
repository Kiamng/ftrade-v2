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
import React, { useMemo } from "react";
import { useCart } from "@/app/(platform)/cart/context/cart-context";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import EmptyState from "@/components/empty";
import { getUserById } from "@/app/api/account/account.api";
const Cart = () => {
  const {
    cartItems,
    removeItem,
    updateQuantity,
    calculateSubtotal,
    calculateTotal,
  } = useCart();
  const session = useSession();
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const productToUpdate = cartItems.find(
      (item) => item.productId === productId
    );
    if (newQuantity > productToUpdate?.quantity!) {
      toast({
        description: "You have reached the max quantity of this product!",
        variant: "destructive",
      });
      return;
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const subtotal = useMemo(() => calculateSubtotal(), [cartItems]);
  const total = useMemo(() => calculateTotal(), [subtotal]);

  return (
    <div className="py-8 px-28 w-full space-y-4 min-h-screen overflow-y-auto">
      <h2 className="w-full text-center font-medium text-xl">YOUR CART</h2>
      {cartItems.length === 0 ? (
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-[200px] h-[200px]">
            <img
              src={`https://icons.veryicon.com/png/o/miscellaneous/contribution/empty-box-1.png`}
              alt="no product"
              height={0}
              width={0}
              className="w-full h-full object-cover"
            ></img>
          </div>
          <h2 className="text-2xl">You do not have any product in your cart</h2>
          <Button>
            <Link href={`/`}>Go shopping</Link>
          </Button>
        </div>
      ) : (
        <>
          <Table className="border">
            <TableHeader className=" rounded">
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[120px]">Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Remove</TableHead>
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
                      {item.status === "SoldOut" ? (
                        <TableCell
                          className="text-center text-red-500"
                          colSpan={2}
                        >
                          Sold Out
                        </TableCell>
                      ) : (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.cartQuantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  parseInt(e.target.value)
                                )
                              }
                            ></Input>
                          </TableCell>
                          <TableCell>
                            {(item.price * item.cartQuantity).toLocaleString()}
                          </TableCell>
                        </>
                      )}

                      <TableCell>
                        <Button
                          onClick={() => handleRemoveItem(item.productId)}
                          size={"icon"}
                          variant={"destructive"}
                        >
                          <X />
                        </Button>
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
          <div className="w-full flex justify-end">
            {session ? (
              <Button
                disabled={
                  cartItems.length === 0 ||
                  cartItems.some((item) => item.status === "SoldOut")
                }
              >
                <Link href={`/cart/checkout`}>Checkout</Link>
              </Button>
            ) : (
              <Link href={`/auth/login`}>
                <Button>Login or register to checkout</Button>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
