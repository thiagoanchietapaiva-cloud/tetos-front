import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarHistoricoImovel = () => {
    return useQuery({
        queryKey: ["historico-imovel"],
        queryFn: async () => {
            const res = await AXIOS.get("/historico-imovel");
            return res.data;
        }
    });
}

export const useCriarHistoricoImovel = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/historico-imovel", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["historico-imovel"]
            })
        }
    });
}

export const useEditarHistoricoImovel = () => {
    return useMutation({
        mutationFn: async ({ id, ...dados }) => {
            const res = await AXIOS.put(`/historico-imovel/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["historico-imovel"]
            })
        }
    })
}

export const useDeletarHistoricoImovel = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/historico-imovel/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["historico-imovel"]
            })
        }
    })
}