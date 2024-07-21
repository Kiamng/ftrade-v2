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
import { CommentByUser, CommentListInfor } from "@/types/comment";
import { getUserById } from "@/app/api/account/account.api";
import { format } from "date-fns";

interface CommentSectionProps {
  isLoading: boolean;
  product: Product | undefined;
}

const CommentSection = ({ isLoading, product }: CommentSectionProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentByUser, setCommentByUser] = useState<CommentByUser[]>([]);
  const [commentListInfor, setCommentListInfor] = useState<CommentListInfor>();
  const [commentValue, setCommentValue] = useState<string>("");
  const [isPending, SetIsPending] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const handleOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value);
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        setCreated(false);
        setCommentLoading(true);
        if (product?.commentCount || product?.commentCount! > 0) {
          const response = await getAllComment(
            product?.productId as string,
            session.data?.user?.token as string
          );
          setCommentListInfor(response);
          const commentByUser = response.items.map(async (comment) => {
            const creator = await getUserById(
              comment.commenterId,
              session.data?.user?.token as string
            );
            return {
              user: creator,
              comment: comment,
            };
          });
          const userComment = await Promise.all(commentByUser);
          setCommentByUser(userComment);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setCommentLoading(false);
      }
    };
    fetchComment();
  }, [product?.commentCount, created === true]);
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
      setCreated(true);
    }
  };
  if (isLoading || commentLoading) {
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

      <div className="comment-list w-full flex flex-col">
        {commentByUser.map((comment) => (
          <div
            key={comment.comment.commentId}
            className=" flex items-start m-4 border-b pb-4"
          >
            <img
              src={
                comment.user.avatarUrl
                  ? comment.user.avatarUrl
                  : defaultUserImg.src
              }
              alt="user Avatar"
              width={36}
              height={36}
              className="rounded-full object-fill"
            ></img>
            <div className="w-full ml-3 space-y-4">
              <div>
                <Link
                  href={"#"}
                  className="hover:underline text-lg font-medium"
                >
                  {comment.user.userName}
                </Link>
                <p>{comment.comment.descript}</p>
              </div>
              <p className="text-sm text-slate-400">
                {format(comment.comment.postDate, "HH:mm dd/MM/yyyy")}
              </p>
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
