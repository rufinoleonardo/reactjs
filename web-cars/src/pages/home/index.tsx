import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// COMPONENTS
import { Container } from "../../components/Container"

// DATABASE
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";


export interface CarProps {
    id: string,
    name: string,
    year: string,
    price: string | number,
    city: string,
    km: string,
    images: CarImageProps[],
    uid: string
}

interface CarImageProps {
    name: string,
    uid: string,
    url: string
}

export function Home() {
    const [cars, setCars] = useState<CarProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])

    useEffect(() => {
        function loadCars() {
            const carsRef = collection(db, `cars`);
            const queryRef = query(carsRef, orderBy("createdAt", "desc"));

            getDocs(queryRef)
                .then(snapshot => {
                    let listCars = [] as CarProps[];

                    snapshot.forEach(doc => {
                        listCars.push({
                            id: doc.id,
                            city: doc.data().city,
                            images: doc.data().images,
                            name: doc.data().name,
                            km: doc.data().km,
                            price: doc.data().price,
                            year: doc.data().year,
                            uid: doc.data().uid
                        })
                    })

                    setCars(listCars)
                })
                .catch(err => console.log(err))
        }

        loadCars();
    }, [])

    function handleImgLoad(id: string) {
        setLoadImages((prevImgLoaded) => [...prevImgLoaded, id])
    }

    return <Container>
        <section className="flex items-center justify-center p-4 bg-white w-full max-w-3xl m-auto rounded-lg gap-2">
            <input className="w-full rounded-lg border-2 h-9 px-3 outline-none"
                type="text"
                placeholder="Search here"
            />
            <button className="bg-red-500 h-9 px-8 text-white font-medium rounded-lg">Buscar</button>
        </section>

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
            Carros usados em todo o Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map(car => (
                <Link to={`/car/${car.id}`} key={car.id}>
                    <section className="w-full bg-white rounded-lg">
                        <div
                            className="w-full h-72 rounded-lg bg-slate-200"
                            style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
                        >

                        </div>
                        <img src={car.images[0].url}
                            alt="Carro"
                            className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                            onLoad={() => handleImgLoad(car.id)}
                            style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                        />

                        <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                        <div className="flex flex-col px-2">
                            <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
                            <strong className="text-black font-medium text-xl">R$ {car.price}</strong>
                        </div>

                        <div className="w-full h-px bg-slate-200 my-2"></div>

                        <div className="px-2 pb-2">
                            <span className="text-zinc-700">{car.city}</span>
                        </div>
                    </section>
                </Link>
            ))}
        </main>
    </Container>
}