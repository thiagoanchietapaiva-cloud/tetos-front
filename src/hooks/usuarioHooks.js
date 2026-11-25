import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/Login", dados);
            return res.data;
        },
    })
}

export const useBuscarUsuario = () =>{
    return useQuery({
        queryKey: ["usuarios"],
        queryFn: async (dados) => {
            const res = await AXIOS.get("/usuarios", dados);
            return res.data;

        }
    });
}

export const useCriarUsuario = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/usuarios", dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey:["usuarios"]
            })
        }
    })
}

export const useEditarUsuario = () => {
    return useMutation({
        mutationFn: async (dados, id) => {
            const res = await AXIOS.put(`/usuarios/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey:["usuarios"]
            })
        }
    })
}

export const useDeletarUsuario = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/usuarios/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey:["usuarios"]
            })
        }
    })
}
export const useCadastrar = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/cadastrar", dados);
            return res.data;
        },
    })
}