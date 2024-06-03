import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { TextArea } from "@/components/textarea";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface TaskDetailsProps {
    item: {
        taskId: string,
        tarefa: string,
        public: boolean,
        user: string,
        createdAt: string
    },
    allComments: CommentProps[]
}

interface CommentProps {
    id: string,
    comment: string,
    taskId: string,
    name: string,
    user: string
}

export default function Task({ item, allComments }: TaskDetailsProps) {
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [comments, setComments] = useState<CommentProps[]>(allComments || [])

    async function handleComment(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;

        if (!session?.user?.email || !session?.user?.name) return;

        try {

            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId,
                createdAt: new Date()
            })

            const data: CommentProps = {
                id: docRef.id,
                comment: input,
                user: session?.user.email,
                name: session.user.name,
                taskId: item?.taskId
            }

            setComments(oldComments => [...oldComments, data])

            setInput("");
        } catch (err) {
            console.log("OCORREU UM ERRO")
            console.log(err)
        }
    }

    async function handleDeleteComment(id: string) {
        try {
            const docRef = doc(db, `comments`, id)
            await deleteDoc(docRef);

            console.log("Tarefa deletada");
            setComments(commentList => commentList.filter(el => el.id != id))
        } catch (err) {
            console.log("UM ERRO INEXPERADO OCORREU");
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

            <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>
                {comments.length === 0 && (
                    <span>Nenhum comentário para esta Tarefa.</span>
                )}

                {comments.map(comment => (
                    <article className={styles.comment} key={comment.id}>
                        <div className={styles.headComment}>
                            <label className={styles.commentLabel}>{comment.name}</label>
                            {comment.user === session?.user?.email && (
                                <button className={styles.trashBtn} onClick={() => handleDeleteComment(comment.id)}>
                                    <FaTrash size={22} color="#EA3140" />
                                </button>
                            )}
                        </div>
                        <p>{comment.comment}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}

// Carregando a tarefa no lado do servidor
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;

    const docRef = doc(db, "tarefas", id);

    const q = query(collection(db, "comments"), where("taskId", "==", id), orderBy("createdAt", "desc"))

    const commentsSnapshot = await getDocs(q)
    let allComments: CommentProps[] = [];

    commentsSnapshot.forEach(snapshot => {
        // const commentDate = new Date(snapshot.data()?.createdAt?.seconds * 1000);

        allComments.push({
            id: snapshot.id,
            comment: snapshot.data()?.comment,
            name: snapshot.data()?.name,
            user: snapshot.data()?.user,
            taskId: id
        })
    })

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

    // console.log(task)
    console.log("allComments".padEnd(100, "."), allComments)

    return {
        props: {
            item: task,
            allComments: allComments
        }
    }
}