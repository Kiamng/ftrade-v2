"use client";

import * as z from "zod";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfileSchema } from "@/schemas/account";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import EditIconAnimate from "@/assets/img/gif/edit.gif";
import EditIconPause from "@/assets/img/gif/edit_pause.png";
import { AtSign, LoaderCircle, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Header } from "../../_components/header";
import { getUserById } from "@/app/api/account/account.api";
import { Account } from "@/types/account";

export const AccountInformation = () => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Account>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullname: "",
      userName: "",
      phoneNumber: "",
    },
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userResponse = await getUserById(
          session.data?.user?.accountId as string,
          session.data?.user?.token as string
        );
        setUser(userResponse);
        form.reset({
          fullname: userResponse.fullName,
          userName: userResponse.userName,
          phoneNumber: userResponse.phoneNumber,
        });
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [session.data?.user?.accountId, session.data?.user?.token]);

  const onSubmit = (values: z.infer<typeof EditProfileSchema>) => {
    // startTransition(async () => {
    //   const response = await patchUserProfile({
    //     token: user?.token!,
    //     fullName: values.fullname,
    //     phoneNumber: values.phoneNumber,
    //   });
    //   if (response.status === 200) {
    //     toast.success("Information updated successfully!");
    //     await update({
    //       user: { name: values.fullname, phoneNumber: values.phoneNumber },
    //     });
    //     setIsEdit(false);
    //   } else {
    //     toast.error("Failed to update information.");
    //   }
    // });
  };
  return (
    <div className="w-full flex flex-col gap-y-6 px-1">
      <div className="w-full flex justify-between items-start">
        <Header title="Account Information" />
        <button
          className="w-[28px] h-[28px] flex items-center justify-center hover:scale-125 rounded-[50%] hover:border-[1px] hover:border-blue-700 cursor-pointer transition"
          onClick={handleEditClick}
        >
          <Image
            src={isEdit ? EditIconAnimate : EditIconPause}
            alt="Edit"
            width={18}
            height={18}
          />
        </button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="h-12 rounded-xl flex flex-row items-center bg-[#a8b3cf14] px-4">
              <Mail
                className={cn("h-5 w-5 mr-2 text-primary hover:text-white")}
              />
              <div className="flex flex-col w-full">
                <div className="border-none w-full px-3 outline-none text-primary shadow-none focus-visible:ring-0 ">
                  {user?.email}
                </div>
              </div>
            </div>
          </FormItem>

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="h-12 rounded-xl overflow-hidden flex flex-row items-center bg-[#a8b3cf14] px-4">
                    <AtSign
                      className={cn(
                        "h-5 w-5 mr-2 text-muted-foreground hover:text-white",
                        form.formState.errors.fullname && "text-destructive"
                      )}
                    />
                    <div className="flex flex-col w-full">
                      <Input
                        type="text"
                        placeholder="Enter username"
                        disabled={!isEdit || isPending}
                        className="border-none w-full text-base outline-none text-muted-foreground shadow-none focus-visible:ring-0 "
                        {...field}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <div className="h-12 w-full rounded-xl overflow-hidden flex flex-row items-center bg-[#a8b3cf14] px-4">
                    <User
                      className={cn(
                        "h-5 w-5 mr-2 text-muted-foreground hover:text-white",
                        form.formState.errors.fullname && "text-destructive"
                      )}
                    />
                    <div className="flex flex-col w-full">
                      <Input
                        type="text"
                        placeholder="Enter fullname"
                        disabled={!isEdit || isPending}
                        className="border-none text-base outline-none text-muted-foreground shadow-none focus-visible:ring-0 "
                        {...field}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <div className="h-12 rounded-xl overflow-hidden flex flex-row items-center bg-[#a8b3cf14] px-4">
                    <Phone
                      className={cn(
                        "h-5 w-5 mr-2 text-muted-foreground hover:text-white",
                        form.formState.errors.fullname && "text-destructive"
                      )}
                    />
                    <div className="flex flex-col w-full">
                      <Input
                        type="text"
                        placeholder="New phone number"
                        disabled={!isEdit || isPending}
                        className="border-none w-full text-base outline-none text-muted-foreground shadow-none focus-visible:ring-0 "
                        {...field}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end ">
            <Button type="submit" disabled={isPending || !isEdit}>
              {isPending ? (
                <div className="flex flex-row items-center">
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving changes
                </div>
              ) : (
                "  Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
