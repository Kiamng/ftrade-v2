import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import defaultUserImg from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";

const CommentSection = () => {
  return (
    <div className="comment-section w-full flex flex-col border-2 rounded-2xl shadow-lg">
      <div className="w-full border-b text-2xl font-medium p-4">
        Comment section
      </div>
      <div className="create-comment w-full flex flex-col p-4 pb-4 border-b space-y-4">
        <Textarea placeholder="Let's ask something about this product or discuss with other people." />
        <div>
          <Button>Send</Button>
        </div>
      </div>
      <div className="comment-list w-full flex flex-col">
        <div className=" flex items-start m-4 border-b pb-4">
          <Image
            src={defaultUserImg}
            alt="user Avatar"
            width={36}
            height={36}
            className="rounded-full object-fill"
          ></Image>
          <div className="w-full ml-3 space-y-4">
            <div>
              <Link href={"#"} className="hover:underline text-lg font-medium">
                quoclam
              </Link>
              <p>Hi guys, which color is the best now ?</p>
            </div>
            <p className="text-sm text-slate-400"> date-date-date</p>
            <div className=" w-full reply-comment flex items-start ">
              <Image
                src={defaultUserImg}
                alt="user Avatar"
                width={36}
                height={36}
                className="rounded-full object-fill"
              ></Image>
              <div className="w-full ml-3">
                <div className=" w-full bg-slate-100 rounded-2xl px-4 py-2 space-y-2">
                  <div>
                    <Link
                      href={"#"}
                      className="hover:underline text-lg font-medium"
                    >
                      minhPhuc
                    </Link>
                    <p>
                      I think you should choose platinum color, it looks luxury
                    </p>
                  </div>
                  <p className="text-sm text-slate-400"> date-date-date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pagnition w-full mx-auto mb-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1/3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
export default CommentSection;
