import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../config";
import { HYDRATE } from "next-redux-wrapper";
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (args) => {
        const { category, filter } = args;
        return {
          url: `/productspublic/${category}`,
          method: "POST",
          body: filter,
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, incomingData) => {
        const newItems = incomingData.products;
        const pagination = incomingData.pagination;

        return {
          products: [...(currentCache.products || []), ...newItems],
          pagination,
        };
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  util: { getRunningQueriesThunk },
} = productsApi;
export const { getProducts } = productsApi.endpoints;
