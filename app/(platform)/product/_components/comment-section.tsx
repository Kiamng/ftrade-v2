"use client";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { createComment, getAllComment } from "@/app/api/comment/comment.api";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { CommentListInfor } from "@/types/comment";

interface CommentSectionProps {
  isLoading: boolean;
  product: Product | undefined;
}

const CommentSection = ({ isLoading, product }: CommentSectionProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [commentListInfor, setCommentListInfor] = useState<CommentListInfor>();
  const [commentValue, setCommentValue] = useState<string>("");
  const [isPending, SetIsPending] = useState<boolean>(false);
  const handleOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value);
  };

  useEffect(() => {
    const fetchComment = async () => {
      if (product?.commentCount || product?.commentCount! > 0) {
        const response = await getAllComment(
          product?.productId as string,
          session.data?.user?.token as string
        );
        console.log(response);

        setCommentListInfor(response);
      }
    };
    fetchComment();
  }, [product?.commentCount]);

  const create = async () => {
    try {
      SetIsPending(true);
      const response = await createComment(
        session.data?.user?.token as string,
        session.data?.user?.accountId as string,
        product?.productId as string,
        commentValue
      );
      if (response === 200) {
        toast({ description: "Comment created successfully !" });
      } else {
        toast({
          description: "Failed to create comment !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      SetIsPending(false);
    }
  };
  if (isLoading) {
    return <Skeleton className="w-full h-[500px] rounded-2xl" />;
  }

  if (!product?.commentCount || product.commentCount === 0) {
    return (
      <div className="rated-secttion w-full flex flex-col border-2 rounded-2xl shadow-lg">
        <div className="w-full border-b text-2xl font-medium p-4">
          Comment section ({product?.commentCount ? product?.commentCount : 0})
        </div>
        <div className="create-comment w-full flex flex-col p-4 pb-4 border-b space-y-4">
          <Textarea
            onChange={handleOnchange}
            placeholder="Let's ask something about this product or discuss with other people."
          />
          <div>
            <Button
              disabled={!commentValue || commentValue === "" || isPending}
              onClick={create}
            >
              Send
            </Button>
          </div>
        </div>
        <div className="w-full text-xl font-normal p-4 text-slate-400">
          This product has no comments yet
        </div>
      </div>
    );
  }
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
        {commentListInfor?.items.map((comment, index) => (
          <div key={index} className=" flex items-start m-4 border-b pb-4">
            <Image
              src={defaultUserImg}
              alt="user Avatar"
              width={36}
              height={36}
              className="rounded-full object-fill"
            ></Image>
            <div className="w-full ml-3 space-y-4">
              <div>
                <Link
                  href={"#"}
                  className="hover:underline text-lg font-medium"
                >
                  quoclam
                </Link>
                <p>Hi guys, which color is the best now ?</p>
              </div>
              <p className="text-sm text-slate-400"> date-date-date</p>
            </div>
          </div>
        ))}
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
