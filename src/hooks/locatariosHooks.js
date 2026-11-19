import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarLocatarios = () => {
    return useQuery({
        queryKey: ["locatarios"],
        queryFn: async () => {
            const res = await AXIOS.get("/locatarios");
            return res.data;
        }
    });
}

export const useCriarLocatarios = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/locatarios", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["locatarios"]
            })
        }
    });
}

export const useEditarLocatarios = () => {
    return useMutation({
        mutationFn: async ({ id, ...dados }) => {
            const res = await AXIOS.put(`/locatarios/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["locatarios"]
            })
        }
    })
}

export const useDeletarLocatarios = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/locatarios/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["locatarios"]
            })
        }
    })
}