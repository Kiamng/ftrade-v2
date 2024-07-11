"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  Filter,
  ListRestart,
} from "lucide-react";
import { Category } from "@/types/category";
import { City } from "@/types/city";
import { Genre } from "@/types/genre";

interface FilterSectionProps {
  handleSortAscending: () => void;
  handleCityChange: (value: string) => void;
  handleSortByChange: (Value: string) => void;
  handleGenreChange: (Value: string) => void;
  handleCategoryChange: (Value: string) => void;
  handleFilter: () => void;
  handleRestart: () => void;
  sortBy: string;
  sortAscending: boolean;
  isLoading: boolean;
  categoryData: Category[] | undefined;
  cityData: City[] | undefined;
  genreData: Genre[] | undefined;
}

const FilterSection = ({
  handleSortAscending,
  handleCityChange,
  handleSortByChange,
  handleGenreChange,
  handleCategoryChange,
  handleFilter,
  handleRestart,
  sortBy,
  sortAscending,
  isLoading,
  categoryData,
  cityData,
  genreData,
}: FilterSectionProps) => {
  if (isLoading) return;
  return (
    <div className="space-x-4 flex">
      <Button size={"icon"} onClick={handleSortAscending}>
        {sortAscending === false ? (
          <ArrowDownNarrowWide />
        ) : (
          <ArrowUpWideNarrow />
        )}
      </Button>

      <Select onValueChange={handleSortByChange} defaultValue={sortBy}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by : " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by :</SelectLabel>
            <SelectItem value="none">--</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="createdDate">Created date</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={handleCityChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="City : " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>City :</SelectLabel>
            <SelectItem value="none">--</SelectItem>
            {cityData?.map((city) => (
              <SelectItem key={city.cityId} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={handleGenreChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Genre : " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Genre :</SelectLabel>
            <SelectItem value="none">--</SelectItem>
            {genreData?.map((genre) => (
              <SelectItem key={genre.genreId} value={genre.name}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category : " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category :</SelectLabel>
            <SelectItem value="none">--</SelectItem>
            {categoryData?.map((category) => (
              <SelectItem key={category.categoryId} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleFilter} size={"icon"}>
        <Filter />
      </Button>
      <Button onClick={handleRestart} size={"icon"}>
        <ListRestart />
      </Button>
    </div>
  );
};
export default FilterSection;
