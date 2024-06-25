import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const LandingHeader = () => {
  return (
    <div className="header flex flex-row items-center justify-between w-full py-[10px] px-20 border-slate-200 border-b-[0.8px]">
      <div className="flex flex-row items-center space-x-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          FTrade
        </h4>
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="right-nav-bar flex flex-row">
          <Button variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="outline" className="ml-2">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LandingHeader;
