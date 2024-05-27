import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

// DATABASE
import { db } from "../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

// COMPONENTS
import { Container } from "../../components/Container";

//INTERFACES
import { CarProps } from "../home";

export function CarDetail() {
    const { id } = useParams();
    const [car, setCar] = useState<CarProps>();
    const [imgsPerView, setImagesPerView] = useState<number>(2)
    const navigate = useNavigate();

    useEffect(() => {

        loadCar();
    }, [id]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setImagesPerView(1);
            } else {
                setImagesPerView(2);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    async function loadCar() {
        if (!id) { return };

        const docRef = doc(db, `cars`, id);
        getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.data() == undefined) {
                    navigate("/")
                }

                setCar({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    city: snapshot.data()?.city,
                    km: snapshot.data()?.km,
                    price: snapshot.data()?.price,
                    year: snapshot.data()?.year,
                    uid: snapshot.data()?.uid,
                    description: snapshot.data()?.description,
                    images: snapshot.data()?.images,
                    model: snapshot.data()?.model,
                    whatsapp: snapshot.data()?.whatsapp
                })
            })
    };


    return <Container>
        {car && (
            <Swiper slidesPerView={imgsPerView} pagination={{ clickable: true }} navigation>
                {car?.images.map(image => (
                    <SwiperSlide key={image.name}>
                        <img src={image.url} className="w-full h-96" />
                    </SwiperSlide>
                ))}
            </Swiper>
        )}

        {car && (
            <main className="w-full bg-white rounded-lg p-6 my-4">
                <div className="w-full flex flex-col sm:flex-row items-center justify-between">
                    <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
                    <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
                </div>
                <p>{car.model}</p>

                <div className="flex w-full gap-6 my-4">{/** div que conterá todas as outras informações */}
                    <div className="flex flex-col gap-4">
                        <div >
                            <p>Cidade</p>
                            <strong>{car?.city}</strong>
                        </div>
                        <div>
                            <p>Ano</p>
                            <strong>{car?.year}</strong>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div >
                            <p>KM</p>
                            <strong>{car?.km}</strong>
                        </div>
                    </div>
                </div>

                <strong>Descrição</strong>
                <p className="mb-4">{car?.description}</p>

                <strong>Telefone/Whatsapp</strong>
                <p className="mb-4">{car?.whatsapp}</p>

                <a href={`https://api.whatsapp.com/send?phone=${car.whatsapp}&text=Olá vi esse ${car.name} no site webcarros e fiquei interessado...`} className="bg-green-700 w-full text-white flex items-center justify-center gap-2 h-11 cursor-pointer rounded-lg">
                    Conversar com o vendedor
                    <FaWhatsapp size={22} color="#FFF" />
                </a>
            </main>
        )}
    </Container>
}