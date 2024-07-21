"use client";

import { getAllProduct } from "@/app/api/product/product.api";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductList } from "@/types/product";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import UserProductList from "./user-product-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface OutOfStockProductProps {
  token: string;
  userId: string;
}

const OutOfStockProduct = ({ token, userId }: OutOfStockProductProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<number>(1);

  const [outOfStockProductList, setOutOfStockProductList] =
    useState<ProductList>();
  useEffect(() => {
    const fetchList = async () => {
      const response = await getAllProduct({
        token: token,
        creatorId: userId,
        pageNumber: 1,
        pageSize: 8,
        isDisplay: "true",
        status: "Out of stock",
        sortBy: "createdDate",
        sortAscending: false,
      });
      setOutOfStockProductList(response);
    };
    fetchList();
  }, []);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

    if (num > outOfStockProductList?.totalPages!) {
      num = outOfStockProductList?.totalPages!;
    }
    setInputValue(num);
  };

  const enterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (outOfStockProductList !== null) {
      if (
        e.code === "Enter" &&
        inputValue <= outOfStockProductList?.totalPages!
      ) {
        setCurrentPage(inputValue);
      }
    }
  };

  if (
    !outOfStockProductList?.items ||
    outOfStockProductList?.items.length === 0
  ) {
    return;
  }

  return (
    <div className="w-full p-8">
      <div className="w-full flex justify-between">
        {isLoading ? (
          <Skeleton className="w-[390px] h-[40px]" />
        ) : (
          <h2 className="text-3xl font-semibold ">Out of stock products</h2>
        )}{" "}
      </div>
      <Separator />
      {outOfStockProductList?.items && (
        <div className="w-full flex flex-col space-y-4">
          <UserProductList
            productList={outOfStockProductList?.items}
            isLoading={isLoading}
          />
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
                    {currentPage}/{outOfStockProductList?.totalPages}
                  </PaginationLink>
                )}
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNextPage()}
                  disabled={currentPage === outOfStockProductList?.totalPages}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
export default OutOfStockProduct;
