import { Link } from "react-router-dom";
import LogoImg from "../../assets/logo.svg";
import { Container } from "../../components/Container";
import { Input } from "../../components/Input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string().email("Por favor, digite um e-mail válido.").min(1, "Campo e-mail não pode estar vazio."),
    password: z.string().min(6, "Digite uma senha com pelo menos 6 caracteres.")
});

type FormData = z.infer<typeof schema>;

export function Login() {
    const { formState: { errors }, handleSubmit, register } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const handleLogin = (data: FormData) => {
        console.log(data)
    }

    return <Container>
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
            <Link to="#" className="w-full max-w-xs mb-6">
                <img src={LogoImg} alt="Logo image" className="w-full" />
            </Link>

            <form className="bg-white w-full max-w-xl" onSubmit={handleSubmit(handleLogin)}>
                <div className="mb-3">
                    <Input
                        type="text"
                        name="email"
                        placeholder="Digite aqui o seu e-mail"
                        error={errors.email?.message}
                        register={register}
                    />
                </div>
                <div className="mb-3">
                    <Input
                        type="password"
                        placeholder="******"
                        name="password"
                        register={register}
                        error={errors.password?.message}
                    />
                </div>
                <button>Enviar</button>
            </form>

        </div>
    </Container>
}