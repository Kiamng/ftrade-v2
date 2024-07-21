"use client";
import * as z from "zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditIconAnimate from "@/assets/img/gif/edit.gif";
import EditIconPause from "@/assets/img/gif/edit_pause.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createProductSchema } from "@/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/product";
import { getProductById, updateProduct } from "@/app/api/product/product.api";
import { getImageData } from "@/actions/getImage";
import CreateFormLoading from "@/app/(platform)/product/_components/create-form-loading";
import { Genre } from "@/types/genre";
import { Category } from "@/types/category";
import { City } from "@/types/city";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/custom/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAllGenres } from "@/app/api/genre/genre.api";
import { getAllCategories } from "@/app/api/category/category.api";
import { getAllCities } from "@/app/api/city/city.api";
import { Separator } from "@/components/ui/separator";
import { uploadImage } from "@/app/api/image/image.apit";
import defaultImg from "@/assets/img/product/default-img.webp";
import { CornerDownLeft } from "lucide-react";
interface EditProductPageProps {
  params: { productId: string };
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const [productImgURL, setProductImgURL] = useState<string>("");

  const { toast } = useToast();
  const session = useSession();
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [noSell, setNoSell] = useState<boolean>(false);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [product, setProduct] = useState<Product>();
  const [imageState, setImageState] = useState<File>();

  const token = session.data?.user?.token;

  const handleGoBack = () => {
    router.back();
  };
  const handleEditClick = () => {
    setIsEdit(!isEdit);
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
      quantity: 0,
      cityId: "",
      genreId: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(
          params.productId,
          token as string
        );
        console.log(response.imagePro);

        setProduct(response);
        const allGenre = await getAllGenres(token as string);
        setGenres(allGenre);
        const allCategory = await getAllCategories(token as string);
        setCategories(allCategory);
        const allCity = await getAllCities(token as string);
        setCities(allCity);
        form.reset({
          title: response.title,
          description: response.description,
          imagePro: response.imagePro,
          price: response.price,
          categoryId: response.categoryId,
          quantity: response.quantity,
          cityId: response.cityId,
          genreId: response.genreId,
        });
        setPreview(response.imagePro);
        setProductImgURL(response.imagePro);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.productId]);

  const handleBrowseImage = () => {
    document.getElementById("imageImporter")?.click();
  };

  const isValidFileType = (file: File) => {
    const acceptedTypes = ["image/png", "image/jpeg", "image/jpeg"];
    return acceptedTypes.includes(file.type);
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
      setImageState(undefined);
      alert("Invalid file type!");
    }
  };
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
    console.log(values);
    console.log(product?.productId);

    try {
      setIsPending(true);
      if (imageState) {
        console.log(1);
        const ImgResponse = await uploadImage(imageState as File);
        const newFormData = { ...values, imagePro: ImgResponse.data.fileUri };
        if (ImgResponse.status === 200) {
          const updateResponse = await updateProduct(
            newFormData,
            token as string,
            params.productId,
            product?.isDisplay as string
          );

          if (updateResponse === 200) {
            toast({
              description: `Your product has been updated successfully ! `,
            });
            router.push(
              `/profile/profileSetting/product/${product?.productId}`
            );
          } else {
            toast({
              description: `There has been some trouble while updating your product, please try again `,
              variant: "destructive",
            });
          }
        } else {
          console.log("failed");
        }
      } else {
        console.log(2);

        const newFormData = { ...values, imagePro: productImgURL };
        const updateResponse = await updateProduct(
          newFormData,
          token as string,
          params.productId,
          product?.isDisplay as string
        );
        if (updateResponse === 200) {
          toast({
            description: `Your product has been updated successfully ! `,
          });
          router.push(`/profile/profileSetting/product/${product?.productId}`);
        } else {
          toast({
            description: `There has been some trouble while updating your product, please try again `,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
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
    <div className="w-full space-y-4">
      <Button onClick={handleGoBack} className="space-x-2">
        {" "}
        <CornerDownLeft /> <span>Go back</span>
      </Button>
      <Card className="w-full">
        <CardHeader>
          <div className="flex">
            <div>
              <CardTitle>Update Product</CardTitle>
              <CardDescription>
                change your product information then submit
              </CardDescription>
            </div>
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

          <Separator />
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
                                  disabled={isPending || !isEdit}
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
                                disabled={isPending || !isEdit}
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
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brand name, color, please describe more about your product"
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
                        name="genreId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex justify-evenly"
                                disabled={isPending || !isEdit}
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
                                  disabled={isPending || noSell || !isEdit}
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
                                  disabled={isPending || noSell || !isEdit}
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
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center justify-between">
                                Product Image (png, jpg and jpeg)
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={isPending || !isEdit}
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
                                  handleOnChangeSeleteImage(event);
                                }}
                                className="hidden"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="w-full h-[200px]">
                        <img
                          src={preview ? preview : defaultImg.src}
                          height={0}
                          width={0}
                          alt="No data"
                          className="w-full h-full object-cover"
                        ></img>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 w-full flex justify-end">
                  {!!isEdit &&
                    (isPending ? (
                      <Button
                        type="submit"
                        disabled={isPending || !isEdit}
                        onClick={() => {
                          toast;
                        }}
                      >
                        <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                        Updating
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        onClick={() => {
                          toast;
                        }}
                      >
                        update
                      </Button>
                    ))}
                </div>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};
export default EditProductPage;
