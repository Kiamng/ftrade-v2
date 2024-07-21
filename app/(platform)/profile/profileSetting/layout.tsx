import { Button } from "@/components/ui/button";
import SideBar from "./_components/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
export default function ProfileSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full  py-8 ">
      <div className="mx-auto h-full ">
        <div className="flex">
          <SideBar />
          <div className="w-full px-8">{children}</div>
          <Toaster />
        </div>
      </div>
    </div>
  );
}
