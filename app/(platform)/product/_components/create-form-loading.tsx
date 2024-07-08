import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const CreateFormLoading = () => {
  return (
    <div className="w-[1000px]">
      <div className="w-full p-6">
        <Skeleton className=" h-[50px] w-full" />
      </div>
      <Separator />

      <div className="w-full flex justify-between px-6 pb-6">
        <div className="information">
          <div className="flex w-full justify-between">
            <div className="flex-col w-[208px]">
              <Skeleton className="h-[18.4px] w-full" />
              <Skeleton className="h-10 mt-2 w-full" />
            </div>
            <div className="flex-col w-[208px]">
              <Skeleton className="h-[18.4px] w-full" />
              <Skeleton className="h-10 mt-2 w-full" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-[18.4px] w-full" />
            <Skeleton className="h-10 mt-2 w-full" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-[18.4px] w-full" />
            <Skeleton className="h-[80px] mt-2 w-full" />
          </div>
          <div className="flex flex-col w-full mt-2 space-y-2">
            <Skeleton className="h-[18.4px] w-full" />
            <div className="flex w-full justify-evenly">
              <Skeleton className="h-4 w-[85px]" />
              <Skeleton className="h-4 w-[85px]" />
              <Skeleton className="h-4 w-[85px]" />
            </div>
          </div>
          <div className="flex w-full justify-between mt-2">
            <div className="flex-col w-[208px]">
              <Skeleton className="h-[18.4px] w-full" />
              <Skeleton className="h-10 mt-2 w-full" />
            </div>
            <div className="flex-col w-[208px]">
              <Skeleton className="h-[18.4px] w-full" />
              <Skeleton className="h-10 mt-2 w-full" />
            </div>
          </div>
        </div>

        <div>
          <div className=" flex mt-4 w-full justify-between items-center">
            <Skeleton className="h-[18.4px] w-[270px]" />
            <Skeleton className="h-9 w-[90px]" />
          </div>
          <Skeleton className="h-[80px] mt-2 w-full" />
          <Skeleton className="h-[300px] mt-2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default CreateFormLoading;
