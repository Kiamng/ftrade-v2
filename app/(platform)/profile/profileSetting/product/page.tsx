"use client";
import { getAllProduct } from "@/app/api/product/product.api";
import { Product, ProductList } from "@/types/product";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "../_components/header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { DataTablePagination } from "@/components/data-table-pagination";

const UserProductList = () => {
  const [productListInfor, setProductListInfor] = useState<ProductList>();
  const [productList, setProductList] = useState<Product[]>([]);
  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productResponse = await getAllProduct({
          token: session.data?.user?.token as string,
          creatorId: session.data?.user?.accountId as string,
        });

        setProductListInfor(productResponse);
        setProductList(productResponse.items);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [session.data?.user?.accountId as string]);
  if (isLoading) {
    return "is loading";
  }
  return (
    <div className="w-full space-y-4">
      <Header title="Product list" />
      <Separator />
      <DataTable columns={columns} data={productList} />
    </div>
  );
};
export default UserProductList;
