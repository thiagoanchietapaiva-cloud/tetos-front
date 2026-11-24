import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarImovel = (query = false) => {
    return useQuery({
        queryKey: ["imoveis"],
        queryFn: async () => {
            const res = await AXIOS.get(query ? `/imoveis${query}` : "/imoveis");
            return res.data;
        }
    });
}

export const useCriarImovel = () => {
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
    })
}

export const useEditarImovel = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/imoveis/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    })
}

export const useDeletarImovel = () => {
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