"use client";
import ProductSection from "@/components/landing-page/product-section";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/hero-highlight";
import { Product, ProductList } from "@/types/product";
import { useEffect, useState } from "react";
import { getAllProduct } from "../../api/product/product.api";
import { LoaderCircle } from "lucide-react";
import ProductSectionLoadingPage from "../product/_components/product-section-loading";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { City } from "@/types/city";
import { Category } from "@/types/category";
import { Genre } from "@/types/genre";
import { useToast } from "@/components/ui/use-toast";
import FilterSection from "@/components/landing-page/filter-section";
import { getAllCategories } from "@/app/api/category/category.api";
import { getAllCities } from "@/app/api/city/city.api";
import { getAllGenres } from "@/app/api/genre/genre.api";
import { Input } from "@/components/ui/input";

export default function Browse() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [productListInfor, setProductListInfor] = useState<ProductList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMoreLoading, setViewMoreLoading] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdDate");
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [city, setCity] = useState<City[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [filter, setFilter] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const session = useSession();
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllProduct({
          token: session.data?.user?.token as string,
          title: title ? title : "",
          status: "Approved",
          pageNumber: currentPage,
          category: selectedCategory !== "none" ? selectedCategory : undefined,
          city: selectedCity !== "none" ? selectedCity : undefined,
          genre: selectedGenre !== "none" ? selectedGenre : undefined,
          isDisplay: "true",
          pageSize: 8,
          sortBy: sortBy || undefined,
          sortAscending: sortAscending,
        });
        setProductList(response.items);
        setProductListInfor(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setFilter(false);
      }
    };

    if (filter) {
      fetchData();
    } else {
      // Initial fetch when component mounts
      fetchData();
    }
  }, [filter, title]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const categoryResponse = await getAllCategories(
          session.data?.user?.token as string
        );
        setCategory(categoryResponse);
        const cityResponse = await getAllCities(
          session.data?.user?.token as string
        );
        setCity(cityResponse);
        const genreResponse = await getAllGenres(
          session.data?.user?.token as string
        );
        setGenre(genreResponse);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFilterData();
  }, [session.data?.user?.token]);

  const handleViewMore = async () => {
    setViewMoreLoading(true);
    try {
      const response = await getAllProduct({
        token: session.data?.user?.token as string,
        status: "Approved",
        pageNumber: currentPage + 1,
        category: selectedCategory !== "none" ? selectedCategory : undefined,
        city: selectedCity !== "none" ? selectedCity : undefined,
        genre: selectedGenre !== "none" ? selectedGenre : undefined,
        isDisplay: "true",
        pageSize: 8,
        sortBy: sortBy || undefined,
        sortAscending: sortAscending,
      });
      setCurrentPage(currentPage + 1);
      setProductList((prevProductList) => [
        ...prevProductList,
        ...response.items,
      ]);
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setViewMoreLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };

  const handleSortByChange = (Value: string) => {
    setSortBy(Value);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    setFilter(true);
  };

  const handleRestart = () => {
    setCurrentPage(1);
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedGenre("");
    setSortAscending(false);
    setSortBy("createdDate");
    setFilter(true);
  };

  const handleSortAscending = () => {
    if (sortBy === "") {
      toast({
        description: `You need to choose the attribue that you want to sort ! `,
        variant: "destructive",
      });
    } else {
      setSortAscending(!sortAscending);
      setCurrentPage(1);
    }
  };
  return (
    <div>
      <BackgroundGradientAnimation>
        <div className="gap-y-6 absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none  text-center md:text-4xl lg:text-7xl">
          <p className=" bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Welcome to <Highlight className="text-black">FTrade</Highlight>
          </p>
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Goods trading services platform
          </p>
        </div>
      </BackgroundGradientAnimation>

      <div className="w-[1400px] mx-auto space-y-4 mt-[40px]">
        <div>
          <h2 className="text-3xl font-semibold mx-auto">List of products</h2>
        </div>
        <div className="w-full flex justify-between">
          <Input
            className="w-[400px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search name"
          ></Input>

          <FilterSection
            handleCategoryChange={handleCategoryChange}
            handleCityChange={handleCityChange}
            handleGenreChange={handleGenreChange}
            handleFilter={handleFilter}
            handleRestart={handleRestart}
            handleSortAscending={handleSortAscending}
            handleSortByChange={handleSortByChange}
            sortAscending={sortAscending}
            sortBy={sortBy}
            isLoading={isLoading}
            categoryData={category}
            cityData={city}
            genreData={genre}
          />
        </div>
        <Separator />
        {isLoading ? (
          <div className="grid grid-cols-4 gap-y-7 gap-x-2 mx-auto pb-4  border-slate-200">
            <ProductSectionLoadingPage /> <ProductSectionLoadingPage />
            <ProductSectionLoadingPage /> <ProductSectionLoadingPage />
          </div>
        ) : (
          <div className=" grid grid-cols-4 gap-y-7 gap-x-2 mx-auto pb-4  border-slate-200">
            {productList?.map((data) => (
              <div key={data.productId}>
                <ProductSection data={data} />
              </div>
            ))}
          </div>
        )}
        <Separator />
        {viewMoreLoading && <LoaderCircle className="animate-spin mx-auto" />}
        <div className="w-full flex justify-center">
          {currentPage === productListInfor?.totalPages ? (
            "No more products"
          ) : (
            <Button variant="link" onClick={() => handleViewMore()}>
              View more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
