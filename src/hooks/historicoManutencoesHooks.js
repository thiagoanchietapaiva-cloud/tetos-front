import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarHistoricoManutencoes = () => {
    return useQuery({
        queryKey: ["historico-manutencoes"],
        queryFn: async () => {
            const res = await AXIOS.get("/historico-manutencoes");
            return res.data;
        }
    });
}

export const useCriarHistoricoManutencoes = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/historico-manutencoes", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["historico-manutencoes"]
            })
        }
    });
}

export const useEditarHistoricoManutencoes = () => {
    return useMutation({
        mutationFn: async ({ id, ...dados }) => {
            const res = await AXIOS.put(`/historico-manutencoes/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["historico-manutencoes"]
            })
        }
    })
}

export const useDeletarHistoricoManutencoes = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/historico-manutencoes/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["historico-manutencoes"]
            })
        }
    })
}