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

function paraNumeroSeForNumero(valor) {
    if (valor === undefined || valor === null || valor === "") return null;
    return isNaN(Number(valor)) ? valor : Number(valor);
}

function paraNumeroOuNull(valor) {
    if (valor === undefined || valor === null || valor === "") return null;
    const num = Number(valor);
    return Number.isNaN(num) ? null : num;
}

function corrigirDadosImovel(dados) {
    return {
        ...dados,
        cep: dados.cep ? String(dados.cep).trim() : "",
        complemento: dados.complemento ? String(dados.complemento).trim() : null,
        imagem: dados.imagem ? String(dados.imagem).trim() : null,
        quartos: paraNumeroOuNull(dados.quartos),
        banheiros: paraNumeroOuNull(dados.banheiros),
        garagens: paraNumeroOuNull(dados.garagens),
        suites: paraNumeroOuNull(dados.suites),
        metragem: paraNumeroOuNull(dados.metragem),
        valor_aluguel: paraNumeroOuNull(dados.valor_aluguel),
        imoveis_tipo_id: paraNumeroSeForNumero(dados.imoveis_tipo_id),
        locatario_id: paraNumeroSeForNumero(dados.locatario_id),
    };
}

export const useCriarImovel = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const corrigidos = corrigirDadosImovel(dados);
            const res = await AXIOS.post("/imoveis", corrigidos);
            if (Array.isArray(res.data)) {
                const erro = new Error(res.data[0]?.description || "Dados inválidos");
                erro.response = { data: res.data };
                throw erro;
            }
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
            const res = await AXIOS.put(`/imoveis/${dados.id}`, corrigirDadosImovel(dados));
            if (Array.isArray(res.data)) {
                const erro = new Error(res.data[0]?.description || "Dados inválidos");
                erro.response = { data: res.data };
                throw erro;
            }
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