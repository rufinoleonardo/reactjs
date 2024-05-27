import { useState, useEffect, useContext } from "react";
import { FiTrash } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

// COMPONENTS
import { Container } from "../../components/Container";
import { DashboardHeader } from "../../components/PanelHeader";

// DATABASE
import { collection, getDocs, orderBy, query, where, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";

// TYPES AND INTERFACES
import { CarProps } from "../home";
import { deleteObject, ref } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

export function Dashboard() {
    const { user } = useContext(AuthContext);
    const [cars, setCars] = useState<CarProps[]>([]);
    const navigate = useNavigate();
    // const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        function loadCars() {
            if (!user?.uid) {
                return
            }

            const carRef = collection(db, `cars`);
            const queryRef = query(carRef,
                where("uid", "==", user.uid),
                orderBy("createdAt", "desc"));

            getDocs(queryRef)
                .then(snapshot => {
                    let listCars = [] as CarProps[];

                    snapshot.forEach(doc => {
                        listCars.push({
                            id: doc.id,
                            name: doc.data().name,
                            year: doc.data().year,
                            km: doc.data().km,
                            city: doc.data().city,
                            price: doc.data().price,
                            images: doc.data().images,
                            uid: doc.data().uid,
                            description: doc.data().description,
                            model: doc.data().model,
                            whatsapp: doc.data().whatsapp
                        })
                    })

                    setCars(listCars)
                }).catch(err => {
                    console.log(err)
                })
        }

        loadCars();
    }, []);

    async function handleDeleteCar(car0: CarProps) {
        const docRef = doc(db, `cars`, car0.id);
        await deleteDoc(docRef);

        car0.images.forEach(async (image) => {
            const imgPath = `images/${image.uid}/${image.name}`;

            const imgRef = ref(storage, imgPath)

            try {
                await deleteObject(imgRef);
            } catch (err) {
                console.log("ERRO AO DELETAR IMAGEM");
                console.log(err)
            }
        })

        setCars(cars.filter(car => car.id != car0.id))

        console.log(cars)
        console.log('CARRO DELETADO.')
        navigate("/dashboard", { replace: true })
    }

    return (
        <Container>
            <DashboardHeader />
            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map(car => (
                    <Link to={`/car/${car.id}`} key={car.id}>
                        <section className="w-full bg-white rounded-lg relative">
                            <button
                                className="absolute bg-white w-12 h-12 flex items-center justify-center rounded-full right-2 top-2 drop-shadow"
                                onClick={() => { handleDeleteCar(car) }}
                            >
                                <FiTrash size={26} color="#000" />
                            </button>
                            <img className="w-full rounded-lg mb-2 max-h-70"
                                src={car.images[0].url}
                            />
                            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

                            <div className="flex flex-col px-2">
                                <span>Ano {car.year} | {car.km} km</span>
                                <strong className="text-black font-bold mt-4">R$ {car.price}</strong>
                            </div>

                            <div className="w-full h-px bg-slate-200 my-2"></div>
                            <div>
                                <span className="text-black">
                                    {car.city}
                                </span>
                            </div>
                        </section>
                    </Link>
                ))}
            </main>
        </Container>
    )
}