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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";

const UserProductList = () => {
  const [productListInfor, setProductListInfor] = useState<ProductList>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
          pageSize: 10,
          pageNumber: currentPage,
        });

        setProductListInfor(productResponse);
        setProductList(productResponse.items);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [session.data?.user?.accountId as string, currentPage]);
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setIsEdit(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setIsEdit(false);
    }
  };

  const handlePageClick = () => {
    setIsEdit(true);
  };

  const addInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = parseInt(e.target.value);
    if (num < 0) {
      num = -num;
    }

    if (num === 0) {
      num = 1;
    }

    if (num > productListInfor?.totalPages!) {
      num = productListInfor?.totalPages!;
    }
    setInputValue(num);
  };

  const enterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (productListInfor !== null) {
      if (e.code === "Enter" && inputValue <= productListInfor?.totalPages!) {
        setCurrentPage(inputValue);
        setIsEdit(false);
      }
    }
  };
  if (isLoading) {
    return "is loading";
  }
  return (
    <div className="w-full space-y-4">
      <Header title="Product list" />
      <Separator />
      <DataTable columns={columns} data={productList} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePreviousPage()}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            {isEdit ? (
              <div className="flex justify-end">
                <Input
                  value={inputValue}
                  onKeyDown={(e) => enterInput(e)}
                  onChange={(e) => addInput(e)}
                  className="w-[70px]"
                  type="number"
                />
              </div>
            ) : (
              <PaginationLink onClick={handlePageClick}>
                {currentPage}/{productListInfor?.totalPages}
              </PaginationLink>
            )}
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNextPage()}
              disabled={currentPage === productListInfor?.totalPages}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
export default UserProductList;
