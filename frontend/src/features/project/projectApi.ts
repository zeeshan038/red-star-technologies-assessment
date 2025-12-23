import { project_url } from "@/lib/config";
import { apiSlice } from "../api/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: ({ workspaceId, body }) => ({
                url: `${project_url}/create/${workspaceId}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Project"],
        }),
        getWorkspaceProjects: builder.query({
            query: (workspaceId) => ({
                url: `${project_url}/all/${workspaceId}`,
                method: "GET",
            }),
            providesTags: ["Project"],
        }),
        getSpecificProject: builder.query({
            query: (projectId) => ({
                url: `${project_url}/${projectId}`,
                method: "GET",
            }),
            providesTags: ["Project"],
        }),
        getProjectAnalytics: builder.query({
            query: (projectId) => ({
                url: `${project_url}/analytics/${projectId}`,
                method: "GET",
            }),
            providesTags: ["Project"],
        }),
        deleteProject: builder.mutation({
            query: (projectId) => ({
                url: `${project_url}/delete/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),
        getActivityLogs: builder.query({
            query: (id) => ({
                url: `${project_url}/analytics/${id}`,
                method: "GET",
            }),
            providesTags: ["Project"],
        }),
    }),
});

export const {
    useCreateProjectMutation,
    useGetWorkspaceProjectsQuery,
    useDeleteProjectMutation,
    useGetSpecificProjectQuery,
    useGetProjectAnalyticsQuery,
    useGetActivityLogsQuery,
} = projectApi;
