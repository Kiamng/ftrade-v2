"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SideBar = () => {
  const [selectedButton, setSelectedButton] = useState<string>("editProfile");

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="w-[300px] flex flex-col">
      <Link href={"/profile/profileSetting/edit-profile"}>
        <Button
          variant={selectedButton === "editProfile" ? "secondary" : "ghost"}
          size={"lg"}
          onClick={() => handleButtonClick("editProfile")}
          className="w-full"
        >
          Edit profile
        </Button>
      </Link>
      <Link href={"/profile/profileSetting/product"}>
        <Button
          variant={selectedButton === "productList" ? "secondary" : "ghost"}
          size={"lg"}
          onClick={() => handleButtonClick("productList")}
          className="w-full"
        >
          Product list
        </Button>
      </Link>
      <Link href={"/profile/profileSetting/order-history"}>
        <Button
          variant={selectedButton === "orderHistory" ? "secondary" : "ghost"}
          size={"lg"}
          onClick={() => handleButtonClick("orderHistory")}
          className="w-full"
        >
          Order history
        </Button>
      </Link>
      <Link href={"/profile/profileSetting/request-from-buyer"}>
        <Button
          variant={
            selectedButton === "requestFromBuyer" ? "secondary" : "ghost"
          }
          size={"lg"}
          onClick={() => handleButtonClick("requestFromBuyer")}
          className="w-full"
        >
          Request from buyer
        </Button>
      </Link>
      <Link href={"/profile/profileSetting/request-history"}>
        <Button
          variant={selectedButton === "yourRequest" ? "secondary" : "ghost"}
          size={"lg"}
          onClick={() => handleButtonClick("yourRequest")}
          className="w-full"
        >
          Your Request
        </Button>
      </Link>
    </div>
  );
};

export default SideBar;
