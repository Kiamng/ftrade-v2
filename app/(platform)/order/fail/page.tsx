import { Button } from "@/components/ui/button";
import Link from "next/link";

const FailPaymentPage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[400px] flex flex-col justify-center space-y-4">
        <img
          className="mx-auto"
          height={300}
          alt="success"
          width={300}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/768px-Cross_red_circle.svg.png"
        ></img>
        <div className="text-2xl text-center font-semibold">
          Payment failed !
        </div>
        <div className="mx-auto flex space-x-2">
          <Button variant={`outline`}>
            <Link href={`/`}>Home</Link>
          </Button>
          <Button variant={`outline`}>
            {" "}
            <Link href={`/cart`}>View cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default FailPaymentPage;
