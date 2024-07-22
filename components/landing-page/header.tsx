"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus, ShoppingCart } from "lucide-react";
import LoggedUser from "../logged-user";
import HeaderMenu from "./header-menu";
import { useCart } from "@/app/(platform)/cart/context/cart-context";

const Header = () => {
  const { data: session, status } = useSession();
  const [productInCart, setProductInCart] = useState<number>(0);
  const cart = useCart();
  useEffect(() => {
    setProductInCart(cart.cartItems.length);
  }, []);
  return (
    <div className="header flex flex-row items-center justify-between w-full py-[10px] px-20 border-slate-200 border-b-[0.8px]">
      <div className="flex flex-row items-center space-x-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          FTrade
        </h4>
        <div className="left-nav-bar flex flex-row">
          <Button variant="ghost">
            <a href="/">Home</a>
          </Button>
          <HeaderMenu />
        </div>
      </div>
      <Input
        className="w-[450px]"
        placeholder="What are you looking for ?"
      ></Input>
      <div className="flex flex-row gap-x-4">
        <div className="flex items-center space-x-2">
          <Button size={`icon`} variant={`ghost`} className="rounded-full">
            <Link href={`/cart`}>
              <ShoppingCart />
            </Link>
            <span className="h-full text-start w-full">{productInCart}</span>
          </Button>
          <Button variant="default" size="icon" className="rounded-full">
            <Link href="/product">
              <Plus />
            </Link>
          </Button>
          <LoggedUser />
        </div>
      </div>
    </div>
  );
};

export default Header;
