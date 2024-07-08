import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const ProductInformationLoading = () => {
  return (
    <div>
      <div className="flex w-full justify-between py-4">
        <Skeleton className="h-9 w-[200px]" />
        <div className="flex space-x-2 items-center">
          <Skeleton className="h-5 w-[60px]" />
          <Skeleton className="h-5 w-[60px]" />
        </div>
      </div>
      <Separator />
      <div className="flex space-x-6 mt-4">
        <Skeleton className="h-[390px] w-[585px]" />
        <div className="information w-[585px]  space-y-3">
          <Skeleton className="h-9 w-[160px]" />
          <Separator />
          <div className="flex w-full justify-between">
            <Skeleton className="h-8 w-[160px]" />
            <Skeleton className="h-8 w-[160px]" />
          </div>
          <Skeleton className="w-full h-[275px]" />
          <Skeleton className="w-full h-[40px]" />
        </div>
      </div>
    </div>
  );
};

export default ProductInformationLoading;
