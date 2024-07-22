"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

import { getAllCities } from "@/app/api/city/city.api";
import { uploadImage } from "@/app/api/image/image.apit";
import { getAllGenres } from "@/app/api/genre/genre.api";
import { getAllCategories } from "@/app/api/category/category.api";

import { Genre } from "@/types/genre";
import { Category } from "@/types/category";
import { City } from "@/types/city";

import { CreateProductAction } from "@/actions/product/createProduct";
import { getImageData } from "@/actions/getImage";
import Image from "next/image";
import defaultImg from "@/assets/img/product/default-img.webp";
import CreateFormLoading from "./create-form-loading";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";

const ProductCreateForm = () => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noSell, setNoSell] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [preview, setPreview] = useState("");
  const [imageState, setImageState] = useState<File>();
  const session = useSession();
  const token = session.data?.user?.token;
  const userId = session.data?.user?.accountId;
  const router = useRouter();

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      imagePro: "",
      price: 0,
      categoryId: "",
      quantity: 1,
      cityId: "",
      genreId: "",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allGenre = await getAllGenres(token as string);
        setGenres(allGenre);
        const allCategory = await getAllCategories(token as string);
        setCategories(allCategory);
        const allCity = await getAllCities(token as string);
        setCities(allCity);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenre = (genreName: string) => {
    if (genreName === "Gift" || genreName === "Exchange") {
      setNoSell(true);
      form.setValue("price", 0);
      form.setValue("quantity", 1);
    } else {
      setNoSell(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    setIsPending(true);

    try {
      if (imageState) {
        const ImgResponse = await uploadImage(imageState as File);
        const newFormData = { ...values, imagePro: ImgResponse.data.fileUri };

        if (ImgResponse.status === 200) {
          const createResponse = await CreateProductAction(
            newFormData,
            userId as string,
            token as string
          );
          if (createResponse === 200) {
            toast({
              description: `Your product has been created successfully ! `,
            });
            router.push(`/profile/profileSetting/product`);
          } else {
            toast({
              description: `There has been some trouble while creating your product, please try again `,
              variant: "destructive",
            });
          }
        } else {
          console.log("failed");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleBrowseImage = () => {
    document.getElementById("imageImporter")?.click();
  };

  const isValidFileType = (file: File) => {
    const acceptedTypes = ["image/png", "image/jpeg", "image/jpeg"];
    return acceptedTypes.includes(file.type);
  };

  const handleOnChangeSelectImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target?.files?.[0];
    if (file && isValidFileType(file)) {
      const imageData = getImageData(event);
      if (imageData) {
        const { file: imageFile, displayUrl } = imageData;
        setPreview(displayUrl);
        setImageState(imageFile);
      } else {
        setImageState(undefined);
        alert("No file selected or invalid file type!");
      }
    } else {
      setImageState(undefined);
      alert("Invalid file type!");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <CreateFormLoading />
      </div>
    );
  }

  return (
    <div className="mt-[20px] w-full flex justify-center">
      <Card className="w-[1000px]">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>
            Fill your product information then submit
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" w-full items-center gap-4">
                <div className="flex justify-between w-full">
                  <div className="information w-[500px] space-y-2">
                    <div className="flex w-full justify-between">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[190px]">
                                    <SelectValue placeholder="Select your category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem
                                      key={category.categoryId}
                                      value={category.categoryId}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cityId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[190px]">
                                  <SelectValue placeholder="Select your campus" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem
                                    key={city.cityId}
                                    value={city.cityId}
                                  >
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="What is your product (Laptop, backpack, ... )"
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brand name, color, please describe more about your product. If you want to exchange, tell us what you are looking for ?"
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
                      name="genreId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex justify-evenly"
                            >
                              {genres.map((genre) => (
                                <FormItem
                                  key={genre.genreId}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={genre.genreId}
                                      onClick={() => handleGenre(genre.name)}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {genre.name}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                className="w-[190px]"
                                type="number"
                                disabled={isPending || noSell}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                className="w-[190px]"
                                type="number"
                                disabled={isPending || noSell}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="image space-y-2">
                    <FormField
                      control={form.control}
                      name="imagePro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center justify-between">
                              Product Image (png, jpg and jpeg)
                              <Button
                                type="button"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleBrowseImage()}
                              >
                                Choose Image
                              </Button>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=""
                              id="imageImporter"
                              disabled={isPending}
                              {...field}
                              onChange={(event) => {
                                handleOnChangeSelectImage(event);
                              }}
                              className="hidden"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full h-[200px]">
                      <Image
                        src={preview ? preview : defaultImg}
                        height={0}
                        width={0}
                        alt="No data"
                        className="w-full h-full object-cover"
                      ></Image>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 w-full flex justify-end">
                {isPending ? (
                  <Button
                    type="submit"
                    disabled={isPending}
                    onClick={() => {
                      toast;
                    }}
                  >
                    <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                    Creating
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => {
                      toast;
                    }}
                  >
                    Create
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCreateForm;

// const handleOnChangeSeleteImage = (
//   event: React.ChangeEvent<HTMLInputElement>
// ) => {
//   const file = event.target?.files?.[0];
//   if (file && isValidFileType(file)) {
//     const { files, displayUrl } = getImageData(event);
//     setPreview(displayUrl);
//     setImageState(files[0]);
//   } else {
//     setImageState(undefined);
//     alert("Invalid file type!");
//   }
// };
