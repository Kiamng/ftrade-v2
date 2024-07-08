"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      setIsLoading(!isLoading);
      signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl ?? "/browse",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email or username..."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <Button
              disabled={isLoading}
              className="ml-auto w-full"
              type="submit"
            >
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              Logging in
            </Button>
          ) : (
            <Button className="ml-auto w-full" type="submit">
              Login
            </Button>
          )}
        </form>
      </Form>
      <div className="flex flex-col gap-y-2">
        <p className="text-sm">Do not have an account ? Join us :</p>
        <Button disabled={isLoading} className="ml-auto w-full">
          <Link href="/auth/register">Register</Link>
        </Button>
      </div>
    </>
  );
}
