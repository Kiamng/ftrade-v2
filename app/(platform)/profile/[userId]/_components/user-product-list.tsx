import ProductSectionLoadingPage from "@/app/(platform)/product/_components/product-section-loading";
import ProductSection from "@/components/landing-page/product-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product";
import { LoaderCircle } from "lucide-react";

interface UserProductListProps {
  productList: Product[] | undefined;
  isLoading: boolean;
}

const UserProductList = ({ productList, isLoading }: UserProductListProps) => {
  return (
    <div className="w-[1400px] mx-auto space-y-4  ">
      {isLoading ? (
        <div className=" grid grid-cols-4 gap-y-7 gap-x-2 mx-auto pb-4  border-slate-200">
          <ProductSectionLoadingPage /> <ProductSectionLoadingPage />
          <ProductSectionLoadingPage /> <ProductSectionLoadingPage />
        </div>
      ) : (
        <div className=" grid grid-cols-4 gap-y-7 gap-x-2 mx-auto pb-4  border-slate-200">
          {productList?.map((data) => (
            <div key={data.productId}>
              <ProductSection data={data} />
            </div>
          ))}
        </div>
      )}
      <Separator />
    </div>
  );
};
export default UserProductList;
