import { ChangeEvent, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiUpload, FiTrash } from "react-icons/fi";

// ! COMPONENTS
import { Container } from "../../../components/Container";
import { DashboardHeader } from "../../../components/PanelHeader";
import { Input } from "../../../components/Input";

// ! DATABASE
import { storage, db } from "../../../services/firebaseConnection";
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";


// ! CONTEXT
import { AuthContext } from "../../../contexts/AuthContext";


// ! FORM
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    name: z.string().min(1, "Campo Nome obrigatório."),
    model: z.string().min(1, "Campo Modelo é obrigatório."),
    year: z.string().min(4, "Campo Ano é obrigatório."),
    km: z.string().min(1, "Campo Km é obrigatório."),
    price: z.string().min(1, "Campo Preço é obrigatório."),
    city: z.string().min(1, "Campo cidade é obrigatório."),
    whatsapp: z.string().min(1, "Campo Telefone é obrigatório.").refine((value) => /^(\d{10,11})$/.test(value), {
        message: "Numero de telefone invalido."
    }),
    description: z.string().min(10, "Campo Descrição é obrigatório.")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
    uid: string,
    name: string,
    previewUrl: string,
    url: string
}

export function NewCar() {
    const { user } = useContext(AuthContext);

    const [carImages, setCarImages] = useState<ImageItemProps[]>([])

    const { register, formState: { errors }, handleSubmit, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    function handleCadastro(data: FormData) {
        if (carImages.length == 0) {
            alert(`Envie alguma imagem deste carro.`);
            return;
        };

        const carListImages = carImages.map(car => {
            return {
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })

        const carsCollection = collection(db, "cars");

        addDoc(carsCollection, {
            name: data.name.toUpperCase(),
            model: data.model,
            year: data.year,
            km: data.km,
            whatsapp: data.whatsapp,
            city: data.city,
            price: data.price,
            description: data.description,
            createdAt: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages
        })
            .then(() => {
                reset();
                setCarImages([]);
                console.log("CADASTRADO COM SUCESSO.")
            })
            .catch(err => {
                console.log("CADASTRADO COM SUCESSO.")
                console.log(err)
            })
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image);
            } else {
                alert("Envie uma imagem JPEG ou PNG");
                return;
            }
        }
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return
        } else {
            const userUid = user.uid;
            const imgUid = uuidv4();

            const storageRef = ref(storage, `/images/${userUid}/${imgUid}`);
            try {
                await uploadBytes(storageRef, image).then((snapshot) => {
                    console.log(snapshot.ref);
                    getDownloadURL(storageRef).then(url => {
                        const imageItem: ImageItemProps = { name: imgUid, uid: userUid, url: url, previewUrl: URL.createObjectURL(image) };

                        setCarImages((images) => [...images, imageItem]);
                    })
                })
            } catch (err) {
                console.log(err)
            }
        }
    }

    async function handleDeleteImage(image: ImageItemProps) {
        const imagePath = `images/${image.uid}/${image.name}`;
        const imageRef = ref(storage, imagePath);
        try {
            await deleteObject(imageRef)

            setCarImages(carImages.filter(car => car.url !== image.url))
        } catch (err) {
            console.log(err)
        }
    }

    return <Container>
        <DashboardHeader />

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
            <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                <div className="absolute cursor-pointer">
                    <FiUpload size={30} color="#000" />
                </div>
                <div className="cursor-pointer">
                    <input type="file"
                        accept="image/*"
                        className="opacity-0 cursor-pointer"
                        onChange={handleFile} />
                </div>
            </button>

            {carImages.map(carImage => (
                <div key={carImage.name} className="w-full h-32 flex items-center justify-center relative">
                    <button className="absolute" onClick={() => handleDeleteImage(carImage)}>
                        <FiTrash size={28} color="#FFF" />
                    </button>
                    <img src={carImage.previewUrl} className="rounded-lg w-full h-32 object-cover" alt="Foto do carro" />
                </div>
            ))}
        </div>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
            <form className="w-full" onSubmit={handleSubmit(handleCadastro)}>
                <div className="mb-3">
                    <p className="mb-2 font-medium">Nome do Carro</p>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Nome do veículo"
                        register={register}
                        error={errors.name?.message} />
                </div>

                <div className="mb-3">
                    <p className="mb-2 font-medium">Modelo do Carro</p>
                    <Input
                        type="text"
                        name="model"
                        placeholder="Modelo do carro"
                        register={register}
                        error={errors.model?.message} />
                </div>

                <div className="flex w-full mb-3 items-center gap-4">
                    <div className="w-full">
                        <p className="mb-2 font-medium">Ano do Carro</p>
                        <Input
                            type="text"
                            name="year"
                            placeholder="Ano do carro"
                            register={register}
                            error={errors.year?.message} />
                    </div>

                    <div className="w-full">
                        <p className="mb-2 font-medium">Kms rodados</p>
                        <Input
                            type="text"
                            name="km"
                            placeholder="Kms rodado"
                            register={register}
                            error={errors.km?.message} />
                    </div>

                </div>

                <div className="w-full flex mb-3 items-start gap-4">
                    <div className="w-full">
                        <p className="mb-3 font-medium">Telefone/Whatsapp</p>
                        <Input type="text"
                            placeholder="Telefone/whatsapp"
                            register={register}
                            name="whatsapp"
                            error={errors.whatsapp?.message} />
                    </div>

                    <div className="w-full">
                        <p className="mb-3 font-medium">Cidade</p>
                        <Input type="text"
                            placeholder="Cidade"
                            register={register}
                            name="city"
                            error={errors.city?.message} />
                    </div>
                </div>

                <div className="w-full mb-3">
                    <p className="mb-2">
                        Preço (em Reais)
                    </p>
                    <Input name="price" type="text" placeholder="20000" register={register} />
                </div>

                <div className="mb-3">
                    <p className="mb-2 font-medium">Descrição</p>
                    <textarea
                        className="border-2 w-full rounded-md h-24 px-2"
                        {...register("description")}
                        name="description"
                        id="description"
                        placeholder="Digite a descrição completa sobre o carro."
                    />
                    {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                </div>

                <button type="submit"
                    className="w-full rounded-md bg-zinc-900 text-white font-medium h-11 px-8 hover:scale-105"
                >
                    Cadastrar veículo
                </button>
            </form>
        </div>
    </Container>
}