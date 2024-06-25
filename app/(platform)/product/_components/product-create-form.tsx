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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { getAllGenre } from "@/app/api/genre/genre.api";
import { Genre } from "@/types/genre";
import { getAllCategories } from "@/app/api/category/category.api";
import { Category } from "@/types/category";
import { getAllCities } from "@/app/api/city/city.api";
import { City } from "@/types/city";
import { toast } from "@/components/ui/use-toast";
import { CreateProduct } from "@/actions/createProduct";
import { getImageData } from "@/actions/getImage";
import Image from "next/image";
import defaultImg from "@/assets/img/product/default-img.webp";
import { uploadImage } from "@/app/api/image/image.apit";

const ProductCreateForm = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [preview, setPreview] = useState("");
  const [imageState, setImageState] = useState<File | null>(null);

  const testData = {
    title: "laptoptest",
    description: "laptoptestlaptoptest",
    imagePro: "abc",
    price: 0,
    categoryId: "5fbd89a6-bf5e-48c6-91e6-9c9f1bf4f0fa",
    quantity: 1,
    cityId: "e36e7d5b-d56c-41d4-aed5-2a5d03340f30",
    genreId: "2869ddcd-0686-4654-9d6d-95131a37a40c",
  };

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
    setIsLoading(!isLoading);
    const getGenre = async () => {
      try {
        const allGenre = await getAllGenre();
        setGenres(allGenre);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const getCategory = async () => {
      try {
        const allCategory = await getAllCategories();

        setCategories(allCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const getCity = async () => {
      try {
        const allCity = await getAllCities();

        setCities(allCity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    setIsLoading(false);
    getGenre();
    getCategory();
    getCity();
  }, []);

  const handleGenre = (genreName: string) => {
    if (genreName === "Gift") {
      setIsFree(true);
      form.setValue("price", 0);
    } else {
      setIsFree(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    setIsPending(true);

    try {
      if (imageState) {
        const ImgResponse = await uploadImage(imageState);
        const newFormData = { ...values, imagePro: ImgResponse.data.fileUri };

        if (ImgResponse.status === 200) {
          const createResponse = await CreateProduct(newFormData);
          console.log("success");
        } else {
          console.log("failed");
        }
      }
      // const response = await CreateProduct(testData);
      // console.log(response);
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

  // const handleOnChangeSeleteImage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target?.files?.[0];
  //   if (file && isValidFileType(file)) {
  //     const { files, displayUrl } = getImageData(event);
  //     setPreview(displayUrl);
  //     setImageState(files[0]);
  //   } else {
  //     setImageState(null);
  //     alert("Invalid file type!");
  //   }
  // };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>
          Fill your product information then submit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
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
                              <SelectTrigger className="w-[208px]">
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
                            <SelectTrigger className="w-[208px]">
                              <SelectValue placeholder="Select your campus" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.cityId} value={city.cityId}>
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
                          placeholder="Brand name, color, please describe more about your product"
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
                  name="imagePro"
                  render={({ field: { onChange, value, ...rest } }) => (
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
                          {...rest}
                          onChange={(event) => {
                            const { files, displayUrl } = getImageData(event);
                            console.log("file la ", files);
                            setPreview(displayUrl);
                            onChange(files);
                            setImageState(files[0]);
                          }}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full">
                  <Image
                    src={preview ? preview : defaultImg}
                    height={200}
                    width={0}
                    alt="No data"
                    className="w-full object-cover
                    "
                  ></Image>
                </div>
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
                            type="number"
                            disabled={isPending || isFree}
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
                            type="number"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 w-full flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => {
                  toast;
                }}
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductCreateForm;
