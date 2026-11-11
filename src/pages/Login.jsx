import { Button, Form, Input, Typography } from "antd";
import { useLogin } from "../hooks/usuarioHooks";

const Login = () => {

    const {mutate: login, isPending: loginPending} = useLogin();
    
    function logar(dados){
        login(dados, {
            onSuccess: (res) => {
                alert(res.description)
            }
        })
    }

    return ( 
    <div className="h-screen flex justify-center items-center relative overflow-hidden bg-blue-950/60 backdrop-blur-md">
        
        <div className="relative z-10 w-95 p-4 bg-white rounded-2xl shadow-2xl">
            
         <Form
         onFinish={logar}
         >
            <Form.Item
            label="Email"
            name={"email"}
            rules={[{ required: true,message: "Por favor, insira seu email!" }]}
            >
                <Input placeholder="Digite seu email"/>
            </Form.Item>
            <Form.Item
            label="Senha"
            name={"password"}
            rules={[{ required: true,message: "Por favor, insira sua senha!" }]}
            >
                <Input placeholder="**********"/>
                
            </Form.Item>
            <Button 
            className="w-full mt-4" 
            type="primary" 
            htmlType="submit">
                 Entrar
            </Button>
            <div className="text-center mt-4">
                <Typography.Text>
                    Não tem uma conta?{" "}
                    <Typography.Link href="">
                        Cadastre-se
                    </Typography.Link>
                </Typography.Text>
            </div>
            
         </Form>
        </div>
    </div> 
        
    );
}
 
export default Login;         