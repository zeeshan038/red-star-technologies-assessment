import { task_url } from "@/lib/config";
import { apiSlice } from "../api/apiSlice";

export const taskApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: ({ projectId, body }) => ({
                url: `${task_url}/create/${projectId}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Task"],
        }),
        getAllTask: builder.query({
            query: ({ projectId, status, assigned_to }) => {
                const params = new URLSearchParams();
                if (projectId) params.append("projectId", projectId);
                if (status) params.append("status", status);
                if (assigned_to) params.append("assigned_to", assigned_to);

                return {
                    url: `${task_url}/all?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Task"],
        }),
        updateTask: builder.mutation({
            query: ({ id, body }) => ({
                url: `${task_url}/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Task"],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `${task_url}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Task"],
        }),
        changeStatus: builder.mutation({
            query: ({ id, body }) => ({
                url: `${task_url}/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Task"],
        }),
        toggleTaskStatus: builder.mutation({
            query: ({ id, body }) => ({
                url: `${task_url}/status/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Task"],
        }),
    }),
});


export const { useCreateTaskMutation, useGetAllTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useToggleTaskStatusMutation } = taskApi;