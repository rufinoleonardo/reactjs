import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { collection, doc, getDoc, query } from "firebase/firestore";

export default function Task() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
            </main>
        </div>
    )
}

// Carregando a tarefa no lado do servidor
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;

    const docRef = doc(db, "tarefas", id);

    const snapshot = await getDoc(docRef); //apenas um documento é retornado

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const miliseconds = snapshot.data()?.createdAt.seconds * 1000;

    const task = {
        taskId: id,
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        user: snapshot.data()?.user,
        createdAt: new Date(miliseconds).toLocaleDateString()
    }

    console.log(task)

    return {
        props: {

        }
    }
}