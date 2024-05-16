import { Container } from "../../components/Container"

export function Home() {
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
            <section className="w-full bg-white rounded-lg">
                <img src="https://www.webmotors.com.br/wp-content/uploads/2021/01/22150915/lamborghini-aventador-6.5-v12-gasolina-lp-7004-roadster-isr-wmimagem14275365412.jpg" alt="Carro" className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all" />

                <p className="font-bold mt-1 mb-2 px-2">Lamborghini Aventafor-6</p>

                <div className="flex flex-col px-2">
                    <span className="text-zinc-700 mb-6">Ano 2016/2016 | 23.000 km</span>
                    <strong className="text-black font-medium text-xl">R$ 1.900.000</strong>
                </div>

                <div className="w-full h-px bg-slate-200 my-2"></div>

                <div className="px-2 pb-2">
                    <span className="text-zinc-700">Curitiba - PR</span>
                </div>
            </section>
        </main>
    </Container>
}