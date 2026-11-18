import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useBuscarImoveisTipo = () => {
    return useQuery({
        queryKey: ["imoveis-tipo"],
        queryFn: async () => {
            const res = await AXIOS.get("/imoveis-tipo");
            return res.data;
        }
    });
}

export const useCriarImoveisTipo = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/imoveis-tipo", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis-tipo"]
            })
        }
    });
}

export const useEditarImoveisTipo = () => {
    return useMutation({
        // 
        mutationFn: async ({ id, ...dados }) => {
            // 
            const res = await AXIOS.put(`/imoveis-tipo/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis-tipo"]
            })
        }
    })
}

export const useDeletarImoveisTipo = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/imoveis-tipo/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis-tipo"]
            })
        }
    })
}
