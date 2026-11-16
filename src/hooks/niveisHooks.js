import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarNiveis = () =>{
    return useQuery({
        queryKey: ["niveis"],
        queryFn: async () => {
            const res = await AXIOS.get("/niveis");
            return res.data;
        }
    });
}

export const useCriarNivel = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/niveis",dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["niveis"]
            })
        }
    });
}

export const useEditarNivel = () => {
    return useMutation({
        mutationFn: async ({ id, ...dados }) => {
            const res = await AXIOS.put(`/niveis/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey:["niveis"]
            })
        }
    })
}

export const useDeletarNivel = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/niveis/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey:["niveis"]
            })
        }
    })
}
