import ProductSection from "@/components/landing-page/product-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product";
import { LoaderCircle } from "lucide-react";
import ProductSectionLoadingPage from "../../product/_components/product-section-loading";

interface UserProductListProps {
  productList: Product[] | undefined;
  viewMoreLoading: boolean;
  totalPages: number | undefined;
  handleViewMore: () => Promise<void>;
  currentPage: number;
  isLoading: boolean;
}

const UserProductList = ({
  currentPage,
  productList,
  viewMoreLoading,
  totalPages,
  handleViewMore,
  isLoading,
}: UserProductListProps) => {
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
      {viewMoreLoading && <LoaderCircle className="animate-spin mx-auto" />}
      <div className="w-full flex justify-center">
        {currentPage === totalPages ? (
          "No more products"
        ) : (
          <Button variant="link" onClick={() => handleViewMore()}>
            View more
          </Button>
        )}
      </div>
    </div>
  );
};
export default UserProductList;
