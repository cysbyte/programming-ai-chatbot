import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";

export const useGetBooks = () => {
    const query = useQuery({ queryKey: ["books"], 
        queryFn: async () => {
            const response = await (client as { api: { books: { $get: () => Promise<Response> } } }).api.books.$get();
            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
            const data = await response.json();
            return data
        }
    });

    return query;
};
