import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarImoveis = () => {
    return useQuery({
        queryKey: ["imoveis"],
        queryFn: async () => {
            const res = await AXIOS.get("/imoveis");
            return res.data;
        }
    });
}

export const useCriarImoveis = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/imoveis", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    });
}

export const useEditarImoveis = () => {
    return useMutation({
        mutationFn: async ({ id, ...dados }) => {
            const res = await AXIOS.put(`/imoveis/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    })
}

export const useDeletarImoveis = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/imoveis/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    })
}