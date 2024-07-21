"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import { getUserById } from "@/app/api/account/account.api";
import { getAllProduct } from "@/app/api/product/product.api";
import { Product, ProductList } from "@/types/product";
import { City } from "@/types/city";
import { Category } from "@/types/category";
import { Genre } from "@/types/genre";
import { Separator } from "@/components/ui/separator";
import { getAllGenres } from "@/app/api/genre/genre.api";
import { getAllCities } from "@/app/api/city/city.api";
import { getAllCategories } from "@/app/api/category/category.api";
import { useToast } from "@/components/ui/use-toast";
import FilterSection from "@/components/landing-page/filter-section";
import EmptyState from "@/components/empty";
import { Skeleton } from "@/components/ui/skeleton";
import UserInformation from "./_components/user-information";
import UserProductList from "./_components/user-product-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import OutOfStockProduct from "./_components/user-out-of-stock-product";
import { Session } from "inspector";

interface ProfilePageProps {
  params: { userId: string };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const account = useSession();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [user, setUser] = useState<Account>();
  const [productListInfor, setProductListInfor] = useState<ProductList>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<number>(1);

  const [viewMoreLoading, setViewMoreLoading] = useState<boolean>(false);

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdDate");

  const [sortAscending, setSortAscending] = useState<boolean>(false);

  const [city, setCity] = useState<City[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = () => {
    setIsEdit(true);
  };

  const addInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = parseInt(e.target.value);
    if (num < 0) {
      num = -num;
    }

    if (num === 0) {
      num = 1;
    }

    if (num > productListInfor?.totalPages!) {
      num = productListInfor?.totalPages!;
    }
    setInputValue(num);
  };

  const enterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (productListInfor !== null) {
      if (e.code === "Enter" && inputValue <= productListInfor?.totalPages!) {
        setCurrentPage(inputValue);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(!isLoading);
        const user = await getUserById(
          params.userId,
          account.data?.user?.token as string
        );
        setUser(user);
        const products = await getAllProduct({
          token: account.data?.user?.token as string,
          creatorId: params.userId,
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
  }, [filter, account.data?.user?.token as string]);

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
              <Skeleton className="w-[390px] h-[40px]" />
            ) : (
              <h2 className="text-3xl font-semibold ">
                Displaying products( {productListInfor?.totalItem} )
              </h2>
            )}
            {productListInfor?.items.length! > 0 && (
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
            )}
          </div>

          <Separator />
        </div>
        {productListInfor?.items.length! > 0 ? (
          <div className="w-full flex flex-col space-y-4">
            <UserProductList
              productList={productListInfor?.items}
              isLoading={isLoading}
            />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviousPage()}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  {isEdit ? (
                    <div className="flex justify-end">
                      <Input
                        value={inputValue}
                        onKeyDown={(e) => enterInput(e)}
                        onChange={(e) => addInput(e)}
                        className="w-[70px]"
                        type="number"
                      />
                    </div>
                  ) : (
                    <PaginationLink onClick={handlePageClick}>
                      {currentPage}/{productListInfor?.totalPages}
                    </PaginationLink>
                  )}
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNextPage()}
                    disabled={currentPage === productListInfor?.totalPages}
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : (
          <EmptyState />
        )}
        <OutOfStockProduct
          token={account.data?.user?.token as string}
          userId={params.userId}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
