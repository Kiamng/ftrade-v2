"use client";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserById, updateAccount } from "@/app/api/account/account.api";
import { Account } from "@/types/account";
import { useForm } from "react-hook-form";
import { ChangePasswordSchema, EditProfileSchema } from "@/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "../_components/header";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/img/user/default-avatar-icon-of-social-media-user-vector.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { getImageData } from "@/actions/getImage";
import { LoaderCircle } from "lucide-react";
import { uploadImage } from "@/app/api/image/image.apit";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import EditIconAnimate from "@/assets/img/gif/edit.gif";
import EditIconPause from "@/assets/img/gif/edit_pause.png";
const EditProfilePage = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [passwordEdit, SetPassWordEdit] = useState<boolean>(false);
  const [user, setUser] = useState<Account>();
  const [preview, setPreview] = useState("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [imageState, setImageState] = useState<File | null>(null);
  const { toast } = useToast();
  const session = useSession();
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
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
      oldPassword: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUserById(
        session.data?.user?.accountId as string,
        session.data?.user?.token as string
      );
      setUser(response);
      form.reset({
        fullname: response.fullName,
        userName: response.userName,
        phoneNumber: response.phoneNumber,
        email: response.email,
      });
    };
    fetchUser();
  }, [session.data?.user?.accountId]);
  const isValidFileType = (file: File) => {
    const acceptedTypes = ["image/png", "image/jpeg"];
    return acceptedTypes.includes(file.type);
  };

  const handleBrowseImage = () => {
    document.getElementById("imageImporter")?.click();
  };

  const handleOnChangeSeleteImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target?.files?.[0];
    if (file && isValidFileType(file)) {
      const { files, displayUrl } = getImageData(event);
      setPreview(displayUrl);
      setImageState(files[0]);
    } else {
      setImageState(null);
      alert("Invalid file type!");
    }
  };

  const handleSaveImage = async () => {
    console.log(imageState);
    try {
      setIsPending(true);
      if (imageState) {
        const imgResponse = await uploadImage(imageState);
        console.log(imgResponse.data.fileUri);

        if (imgResponse.status === 200) {
          const updateResponse = await updateAccount(
            user?.email as string,
            imgResponse.data.fileUri,
            user?.passwordHash as string,
            "",
            "",
            user?.userName as string,
            user?.fullName as string,
            user?.phoneNumber as string,
            session.data?.user?.token as string,
            session.data?.user?.accountId as string
          );
          if (updateResponse === 200) {
            toast({ description: "Updated avatar successfully !" });
          } else {
            toast({
              description: "Failed to update avatar !",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = async (value: z.infer<typeof EditProfileSchema>) => {
    try {
      setIsPending(true);
      const updateResponse = await updateAccount(
        user?.email as string,
        user?.avatarUrl as string,
        user?.passwordHash as string,
        "",
        "",
        value.userName as string,
        value.fullname as string,
        value?.phoneNumber as string,
        session.data?.user?.token as string,
        session.data?.user?.accountId as string
      );
      if (updateResponse === 200) {
        toast({ description: "Updated information successfully !" });
      } else {
        toast({
          description: "Failed to update information !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  const updatePassword = async (
    value: z.infer<typeof ChangePasswordSchema>
  ) => {
    try {
      setIsPending(true);
      const updateResponse = await updateAccount(
        user?.email as string,
        user?.avatarUrl as string,
        value.oldPassword,
        value.newPassword,
        value.confirmPassword,
        user?.userName as string,
        user?.fullName as string,
        user?.phoneNumber as string,
        session.data?.user?.token as string,
        session.data?.user?.accountId as string
      );
      if (updateResponse === 200) {
        toast({ description: "Updated information successfully !" });
      } else {
        toast({
          description: "Failed to update information !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="flex pb-10 flex-col no-scrollbar w-full space-y-8">
      <Header title="Profile" label="Edit your profile " />
      <Separator />
      <div>
        <Header title="Avatar" />
        <div className="flex w-full justify-between items-end ">
          <div className="rounded-[10px] overflow-hidden">
            <Avatar className="w-24 h-24">
              <AvatarImage
                className="object-cover"
                src={
                  preview
                    ? preview
                    : user?.avatarUrl
                    ? user?.avatarUrl
                    : defaultAvatar.src
                }
              />
              <AvatarFallback>GE</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-row gap-[16px]">
            <div>
              <Input
                type="file"
                name="file"
                id="imageImporter"
                className="hidden"
                onChange={(event) => handleOnChangeSeleteImage(event)}
              />
              <div className="flex flex-row gap-5">
                <Button
                  disabled={isPending}
                  onClick={() => handleBrowseImage()}
                >
                  Change Image
                </Button>

                {imageState ? (
                  <Button
                    disabled={isPending}
                    onClick={() => handleSaveImage()}
                  >
                    {isPending ? (
                      <div className="flex flex-row items-center">
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </div>
                    ) : (
                      "  Save "
                    )}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex space-x-4 items-center">
          <Header title="Information" />
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
            className="w-full mt-4 space-y-4 h-[212px]"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" disabled={true} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isPending || !isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isPending || !isEdit}
                        {...field}
                      />
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
                    <FormLabel>Phonenumber</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isPending || !isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full justify-end">
              {isEdit && (
                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <div className="flex flex-row items-center">
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </div>
                  ) : (
                    "  Save "
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div>
        <Header title="Change password" />
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(updatePassword)}
            className="w-full mt-4 space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isPending || !isEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isPending || !isEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isPending || !isEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              {isEdit && (
                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <div className="flex flex-row items-center">
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </div>
                  ) : (
                    "  Save "
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default EditProfilePage;
