import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../components/Container";
import LogoImg from "../../assets/logo.svg";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/Input";

import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const schema = z.object({
    name: z.string().min(5, "Digite seu nome completo...").includes(" ", { message: "Digite nome e sobrenome, por gentileza." }),
    email: z.string().email("Digite um e-mail válido"),
    password: z.string().min(6, "Sua senha precisa ter pelo menos 6 caracteres.")
})

type FormData = z.infer<typeof schema>;

export function Register() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const onSubmit = async (data: FormData) => {
        await createUserWithEmailAndPassword(auth, data.email, data.password).then(async (user) => {
            await updateProfile(user.user, { displayName: data.name })
            console.log("CADASTRO REALIZADO COM SUCESSO.")
            navigate("/dashboard", { replace: true })
        }).catch(err => {
            console.log("ERRO AO CADASTRAR O USUÁRIO.")
            console.log(err)
        })
    }

    return <Container>
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4">
            <Link to="/" className="w-full max-w-xs mb-6">
                <img src={LogoImg} alt="Logo image" className="w-full" />
            </Link>

            <form className="w-full bg-white max-w-xl p-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Input name="name" type="text" placeholder="Digite seu nome completo..." register={register} error={errors.name?.message} />
                </div>

                <div className="mb-3">
                    <Input name="email" placeholder="Digite seu e-mail aqui" type="email" register={register} error={errors.email?.message} />
                </div>

                <div className="mb-3">
                    <Input name="password" type="password" placeholder="******" register={register} error={errors.password?.message} />
                </div>

                <button type="submit" className="bg-zinc-900 w-full rounded-md h-10 text-white font-medium">Registrar</button>
            </form>

            <Link to="/login">Já possuo cadastro</Link>
        </div>
    </Container>
}