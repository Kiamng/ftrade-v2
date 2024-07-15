export type Product = {
  productId: string;
  category: {
    categoryId: string;
    name: string;
  };
  city: {
    cityId: string;
    name: string;
  };
  genre: {
    genreId: string;
    name: string;
  };
  title: string;
  description: string;
  imagePro: string;
  creatorId: string;
  price: number;
  categoryId: string;
  createdDate: Date;
  rated: number;
  ratedCount: number;
  commentCount: number;
  discount: number;
  quantity: number;
  cityId: string;
  denyRes: string;
  status: string;
  genreId: string;
  isDisplay: string;
};

export type ProductList = {
  items: Product[];
  totalItem: number;
  pageSize: number;
  totalPages: number;
  pageNumber: number;
};

export type updateProductStatusType = {
  denyRes: string;
  status: string;
  isDisplay: string;
};
