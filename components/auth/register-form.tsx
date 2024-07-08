"use client";
import { Register } from "@/actions/register";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      username: "",
      fullname: "",
      phoneNumber: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      setIsPending(!isPending);
      const response = await Register(values);
      if (response.success) {
        toast({
          description: `${values.username} added successfully !`,
        });
      } else {
        toast({
          description: `${response.error}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="Email"
                    placeholder="Enter the Email"
                    disabled={isPending}
                    {...field}
                  />
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
                    placeholder="Enter fullname"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter username"
                    disabled={isPending}
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
                    placeholder="Enter password"
                    disabled={isPending}
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
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter phone number"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isPending ? (
            <Button
              className="ml-auto w-full mt-4"
              type="submit"
              disabled={isPending}
              onClick={() => {
                toast;
              }}
            >
              <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              Signing up
            </Button>
          ) : (
            <Button
              className="ml-auto w-full mt-4"
              type="submit"
              onClick={() => {
                toast;
              }}
            >
              Sign up
            </Button>
          )}
        </form>
      </Form>
      <div className="flex flex-row gap-x-2 w-full mt-4">
        <Button className="w-full">
          <Link href="/">Home</Link>
        </Button>
        <Button className="w-full">
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
