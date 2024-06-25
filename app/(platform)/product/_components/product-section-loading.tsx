import { Skeleton } from "@/components/ui/skeleton";

const ProductSectionLoadingPage = () => {
  return (
    <div>
      <div className="product-card flex flex-col w-full  rounded-2xl p-4 space-y-3 group">
        <div className="product-img h-[200px]">
          <Skeleton className="product-img w-full h-full rounded-2xl" />
        </div>
        <Skeleton className="w-full h-7" />
        <div className="flex flex-row w-full justify-between">
          <Skeleton className="w-[100px] h-[29.6px]" />
          <Skeleton className="w-[50px] h-[29.6px]" />
        </div>
        <Skeleton className="description w-full h-[100px]" />
        <Skeleton className="buy-button w-full h-[40px]" />
      </div>
    </div>
  );
};

export default ProductSectionLoadingPage;
