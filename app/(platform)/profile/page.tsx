"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import { getUserById } from "@/app/api/account/account.api";
import { getDisplayingProductByUserId } from "@/app/api/product/product.api";
import { Product, ProductList } from "@/types/product";
import UserInformation from "./_components/user-information";
import UserProductList from "./_components/user-product-list";

const ProfilePage = () => {
  const account = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Account>();
  const [productListInfor, setProductListInfor] = useState<ProductList>();
  const [productList, setProductList] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMoreLoading, setViewMoreLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(!isLoading);
        const user = await getUserById(
          account.data?.user?.accountId as string,
          account.data?.user?.token as string
        );
        setUser(user);
        const products = await getDisplayingProductByUserId(
          account.data?.user?.accountId as string,
          currentPage,
          8,
          account.data?.user?.token as string
        );
        setProductListInfor(products);
        setProductList(products.items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [account.data?.user?.accountId]);

  const handleViewMore = async () => {
    setViewMoreLoading(true);
    try {
      const response = await getDisplayingProductByUserId(
        account.data?.user?.accountId as string,
        currentPage,
        8,
        account.data?.user?.token as string
      );
      setCurrentPage(currentPage + 1);
      setProductList((prevProductList) => [
        ...prevProductList,
        ...response.items,
      ]);
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setViewMoreLoading(false);
    }
  };
  return (
    <div className="w-full p-6 space-y-4">
      <div className="w-full flex flex-col justify-center space-y-10">
        <UserInformation user={user} isLoading={isLoading} />
        <UserProductList
          currentPage={currentPage}
          handleViewMore={handleViewMore}
          productList={productList}
          totalItem={productListInfor?.totalItem}
          totalPages={productListInfor?.totalPages}
          viewMoreLoading={viewMoreLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
