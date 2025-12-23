import { workspace_url } from "@/lib/config";
import { apiSlice } from "../api/apiSlice";

export const workspaceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createWorkspace: builder.mutation({
            query: (body) => ({
                url: `${workspace_url}/create`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Workspace"],
        }),
        getAllWorkspace: builder.query({
            query: () => ({
                url: `${workspace_url}/all`,
                method: "GET",
            }),
            providesTags: ["Workspace"],
        }),
        getSpecificWorkspace: builder.query({
            query: (id) => ({
                url: `${workspace_url}/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Workspace", id }],
        }),
        addMemberToWorkspace: builder.mutation({
            query: ({ workspaceId, memberId, body }) => ({
                url: `${workspace_url}/add-member/${workspaceId}/${memberId}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Workspace"],
        }),
        getAllMembers: builder.query({
            query: (workspaceId) => ({
                url: `${workspace_url}/members/${workspaceId}`,
                method: "GET",
            }),
        }),
        updateWorkspace: builder.mutation({
            query: ({ id, body }) => ({
                url: `${workspace_url}/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Workspace"],
        }),
        deleteWorkspace: builder.mutation({
            query: (id) => ({
                url: `${workspace_url}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Workspace"],
        }),
    }),
});

export const {
    useCreateWorkspaceMutation,
    useGetAllWorkspaceQuery,
    useGetSpecificWorkspaceQuery,
    useAddMemberToWorkspaceMutation,
    useGetAllMembersQuery,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation
} = workspaceApi;
