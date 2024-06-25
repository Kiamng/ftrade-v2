import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Product } from "@/types/product";
import macbook from "@/assets/img/product/macbook.png";

interface ProductSectionProps {
  data: Product;
}

const ProductSection = ({ data }: ProductSectionProps) => {
  return (
    <div className="product-card flex flex-col w-full hover:shadow-xl rounded-2xl p-4 space-y-3 group">
      <div className="product-img h-[200px]">
        <Image
          alt="category img"
          src={macbook}
          width={0}
          height={0}
          className="rounded-2xl w-full h-full group-hover:scale-95 transform object-cover shadow-md transition duration-200"
        ></Image>
      </div>
      <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
        {data.title}
      </h4>
      <div className="flex flex-row w-full justify-between">
        <Badge className="text-base">
          {data.price === 0 ? "Free" : `${data.price} VND`}
        </Badge>
        <Badge variant="secondary" className="text-base">
          {data.genre.name}
        </Badge>
      </div>
      <div className="bg-slate-100 p-4 rounded-2xl text-sm min-h-[100px]">
        {data.description}
      </div>
      <Button>VIEW DETAIL</Button>
    </div>
  );
};
export default ProductSection;
