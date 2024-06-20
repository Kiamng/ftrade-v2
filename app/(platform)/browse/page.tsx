"use client";
import Header from "@/components/landing-page/header";
import ProductSection from "@/components/landing-page/product-section";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/hero-highlight";
import { Product, ProductList } from "@/types/product";
import { useEffect, useState } from "react";
import { getProductByStatus } from "../../api/product/product.api";
import { link } from "fs";
import { LoaderCircle } from "lucide-react";

export default function Browse() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [productListInfor, setProductListInfor] = useState<ProductList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMoreLoading, setViewMoreLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(!isLoading);
        const response = await getProductByStatus("Approved", 1, 8);
        setProductList(response.items);
        setProductListInfor(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewMore = async () => {
    setViewMoreLoading(true);
    try {
      const response = await getProductByStatus("Approved", currentPage + 1, 8);
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
    <div>
      <BackgroundGradientAnimation>
        <div className="gap-y-6 absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none  text-center md:text-4xl lg:text-7xl">
          <p className=" bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Welcome to <Highlight className="text-black">FTrade</Highlight>
          </p>
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Goods trading services platform
          </p>
        </div>
      </BackgroundGradientAnimation>

      <div className="w-[1200px] mx-auto space-y-4 mt-[40px]">
        <h2 className="text-3xl font-semibold mx-auto">List of products</h2>
        <div className="grid grid-cols-4 gap-y-7 mx-auto pb-4 border-b-[2px] border-t-[2px] border-slate-200">
          {productList?.map((data) => (
            <div key={data.productId}>
              <ProductSection data={data} />
            </div>
          ))}
        </div>
        {viewMoreLoading && <LoaderCircle className="animate-spin mx-auto" />}
        <div className="w-full flex justify-center">
          {currentPage === productListInfor?.totalPages ? (
            "No more products"
          ) : (
            <Button variant="link" onClick={() => handleViewMore()}>
              View more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
