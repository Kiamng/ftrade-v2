import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Product } from "@/types/product";
import macbook from "@/assets/img/product/macbook.png";
import Link from "next/link";
import { format } from "date-fns";

interface ProductSectionProps {
  data: Product | undefined;
}

const ProductSection = ({ data }: ProductSectionProps) => {
  const formattedDate = data?.createdDate
    ? format(data?.createdDate, "HH:mm dd/MM/yyyy")
    : "";
  return (
    <div className="product-card flex flex-col w-full hover:shadow-xl rounded-2xl p-4 space-y-2 group">
      <div className="product-img h-[200px]">
        <img
          alt="category img"
          src={data?.imagePro ? data?.imagePro : macbook.src}
          width={0}
          height={0}
          className="rounded-2xl w-full h-full group-hover:scale-95 transform object-cover shadow-md transition duration-200"
        ></img>
      </div>
      <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
        {data?.title}
      </h4>
      <p className="text-sm text-slate-500 underline">{formattedDate}</p>

      <div className="flex flex-row w-full justify-between">
        {data?.genre.name === "Exchange" || data?.genre.name === "Gift" ? (
          <></>
        ) : (
          <Badge className="text-base">
            {data?.price === 0 ? "Free" : `${data?.price.toLocaleString()} VND`}
          </Badge>
        )}

        <Badge className="text-base">{data?.genre.name}</Badge>
      </div>
      <div className="bg-slate-100 p-4 rounded-2xl text-sm min-h-[100px]">
        {data?.description}
      </div>
      <Link href={`/product/${data?.productId}`}>
        <Button className="font-semibold w-full">VIEW DETAIL</Button>
      </Link>
    </div>
  );
};
export default ProductSection;
