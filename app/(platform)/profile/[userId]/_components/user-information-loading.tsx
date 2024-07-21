import { Skeleton } from "@/components/ui/skeleton";

const UserInformationLoading = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <Skeleton className="rounded-full w-[100px] h-[100px]" />
      <Skeleton className="w-[175px] h-[84px]" />
    </div>
  );
};
export default UserInformationLoading;
