"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import { getUserById } from "@/app/api/account/account.api";
import {
  getAllProduct,
  getDisplayingProductByUserId,
} from "@/app/api/product/product.api";
import { Product, ProductList } from "@/types/product";
import UserInformation from "./_components/user-information";
import UserProductList from "./_components/user-product-list";
import { City } from "@/types/city";
import { Category } from "@/types/category";
import { Genre } from "@/types/genre";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";
import { getAllGenres } from "@/app/api/genre/genre.api";
import { getAllCities } from "@/app/api/city/city.api";
import { getAllCategories } from "@/app/api/category/category.api";
import { useToast } from "@/components/ui/use-toast";
import FilterSection from "@/components/landing-page/filter-section";

const ProfilePage = () => {
  const account = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Account>();
  const [productListInfor, setProductListInfor] = useState<ProductList>();
  const [productList, setProductList] = useState<Product[]>([]);
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
  const { toast } = useToast();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(!isLoading);
        const user = await getUserById(
          account.data?.user?.accountId as string,
          account.data?.user?.token as string
        );
        setUser(user);
        const products = await getAllProduct({
          token: account.data?.user?.token as string,
          creatorId: account.data?.user?.accountId as string,
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
        setProductListInfor(products);
        setProductList(products.items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (filter) {
      fetchUserData();
    } else {
      // Initial fetch when component mounts
      fetchUserData();
    }
  }, [filter]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const categoryResponse = await getAllCategories(
          account.data?.user?.token as string
        );
        setCategory(categoryResponse);
        const cityResponse = await getAllCities(
          account.data?.user?.token as string
        );
        setCity(cityResponse);
        const genreResponse = await getAllGenres(
          account.data?.user?.token as string
        );
        setGenre(genreResponse);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFilterData();
  }, [account.data?.user?.token]);
  const handleViewMore = async () => {
    setViewMoreLoading(true);
    try {
      const response = await getAllProduct({
        token: account.data?.user?.token as string,
        creatorId: account.data?.user?.accountId as string,
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
    <div className="w-full p-6 space-y-4">
      <div className="w-full flex flex-col justify-center space-y-10">
        <UserInformation user={user} isLoading={isLoading} />
        <div className="w-[1400px] mx-auto space-y-4 ">
          <div className="w-full flex justify-between">
            {isLoading ? (
              <h2 className="text-3xl font-semibold ">
                Displaying products{" "}
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              </h2>
            ) : (
              <h2 className="text-3xl font-semibold ">
                Displaying products( {productListInfor?.totalItem} )
              </h2>
            )}
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
        </div>
        <UserProductList
          currentPage={currentPage}
          handleViewMore={handleViewMore}
          productList={productList}
          totalPages={productListInfor?.totalPages}
          viewMoreLoading={viewMoreLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
