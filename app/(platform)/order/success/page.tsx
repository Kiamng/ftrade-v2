import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessPaymentPage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[400px] flex flex-col justify-center space-y-4">
        <img
          className="mx-auto"
          height={300}
          alt="success"
          width={300}
          src="https://static.vecteezy.com/system/resources/thumbnails/025/210/762/small_2x/check-mark-icon-transparent-background-checkmark-icon-approved-symbol-confirmation-sign-design-elements-checklist-positive-thinking-sign-correct-answer-verified-badge-flat-icon-png.png"
        ></img>
        <div className="text-2xl text-center font-semibold">
          Payment success !
        </div>
        <div className="mx-auto">
          <Button variant={`outline`}>
            <Link href={`/`}>Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default SuccessPaymentPage;
