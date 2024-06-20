"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import LoggedUser from "../logged-user";
import HeaderMenu from "./header-menu";

const Header = () => {
  const { data: session, status } = useSession();
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
        {!session ? (
          <div className="right-nav-bar flex flex-row">
            <Button variant="outline">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="outline" className="ml-2">
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="default" size="icon" className="rounded-full">
              <Link href="/product">
                <Plus />
              </Link>
            </Button>
            <LoggedUser />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
