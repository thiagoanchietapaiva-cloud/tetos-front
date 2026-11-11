import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const response = await AXIOS.post("/Login", dados);
            return res.data;
        }
    })
} 