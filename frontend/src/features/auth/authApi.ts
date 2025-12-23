import { user_url } from "@/lib/config";
import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: `${user_url}/login`,
                method: "POST",
                body,
            }),
        }),
        register: builder.mutation({
            query: (body) => ({
                url: `${user_url}/register`,
                method: "POST",
                body
            }),
        }),
        searchUsers: builder.query({
            query: (query) => ({
                url: `${user_url}/search?query=${query}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLazySearchUsersQuery } = authApi;
