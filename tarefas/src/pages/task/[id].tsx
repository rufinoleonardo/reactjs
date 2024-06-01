import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection, doc, getDoc, query } from "firebase/firestore";
import { TextArea } from "@/components/textarea";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";

interface TaskDetailsProps {
    item: {
        taskId: string,
        tarefa: string,
        public: boolean,
        user: string,
        createdAt: string
    }
}

export default function Task({ item }: TaskDetailsProps) {
    const { data: session } = useSession();
    const [input, setInput] = useState('');

    async function handleComment(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;

        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                createdAt: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            })

            setInput("");
        } catch (err) {
            console.log("OCORREU UM ERRO")
            console.log(err)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.taskContainer}>
                    <p>{item.tarefa}</p>
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar comentário</h2>

                <form onSubmit={handleComment}>
                    <TextArea
                        placeholder="Digite seu comentário"
                        value={input}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} />
                    <button type="submit" className={styles.btn} disabled={!session?.user}>
                        Comentar
                    </button>
                </form>

            </section>
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
            item: task
        }
    }
}