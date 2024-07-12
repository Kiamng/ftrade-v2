import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { category, statuses } from "@/data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: TData[];
}

interface filterOptions {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const genreColumn = table.getColumn("genre_name");
  let genreOptions: filterOptions[] = [];
  if (genreColumn && genreColumn.getSize() > 0) {
    const allGenres = data.map((item: any) => item.genre.name);
    const uniqueGenreSet = new Set(allGenres);
    const uniqueGenre = Array.from(uniqueGenreSet) as string[];

    const genresData = uniqueGenre.map((genre) => ({
      label: genre,
      value: genre,
    }));
    genreOptions.push(...genresData);
  }

  const categoryColumn = table.getColumn("category_name");
  let categoryOptions: filterOptions[] = [];
  if (categoryColumn && categoryColumn.getSize() > 0) {
    const allCategories = data.map((item: any) => item.category.name);
    const uniqueCategoriesSet = new Set(allCategories);
    const uniqueCategories = Array.from(uniqueCategoriesSet) as string[];

    const categoriesData = uniqueCategories.map((category) => ({
      label: category,
      value: category,
    }));
    categoryOptions.push(...categoriesData);
  }

  const cityColumn = table.getColumn("city_name");
  let cityOptions: filterOptions[] = [];
  if (cityColumn && cityColumn.getSize() > 0) {
    const allCities = data.map((item: any) => item.city.name);
    const uniqueCitySet = new Set(allCities);
    const uniqueCity = Array.from(uniqueCitySet) as string[];

    const citiesData = uniqueCity.map((city) => ({
      label: city,
      value: city,
    }));
    cityOptions.push(...citiesData);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
        </div>
        <div className="flex gap-x-2">
          {categoryColumn && (
            <DataTableFacetedFilter
              column={categoryColumn}
              title="Category"
              options={categoryOptions}
            />
          )}
        </div>
        <div className="flex gap-x-2">
          {genreColumn && (
            <DataTableFacetedFilter
              column={genreColumn}
              title="Genre"
              options={genreOptions}
            />
          )}
        </div>
        <div className="flex gap-x-2">
          {cityColumn && (
            <DataTableFacetedFilter
              column={cityColumn}
              title="City"
              options={cityOptions}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
