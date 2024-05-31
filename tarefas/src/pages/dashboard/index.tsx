import styles from './styles.module.css';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import { db } from '@/services/firebaseConnection';
import { addDoc, collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

import { TextArea } from '@/components/textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface DashboardProps {
    user: {
        email: string
    }
}

interface TaskProps {
    id: string,
    createdAt: Date,
    public: boolean,
    user: string,
    tarefa: string
}

export default function Dashboard({ user }: DashboardProps) {
    const [inputValue, setInputValue] = useState("");
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([]);

    useEffect(() => {
        async function loadTarefas() {
            const tarefasRef = collection(db, "tarefas")
            const q = query(
                tarefasRef,
                orderBy("createdAt", "desc"),
                where("user", "==", `${user?.email}`)
            )

            onSnapshot(q, (snapshot) => {
                let list = [] as TaskProps[];

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        createdAt: doc.data().createdAt,
                        public: doc.data().public,
                        tarefa: doc.data().tarefa,
                        user: doc.data().user
                    })
                })

                setTasks(list);
            })
        }

        loadTarefas();
    }, [user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target.checked);

        setPublicTask(event.target.checked)
    }

    async function handleRegisterTask(event: FormEvent) {
        event.preventDefault();

        if (inputValue == "") return;

        try {
            await addDoc(collection(db, "tarefas"), {
                tarefa: inputValue,
                createdAt: new Date(),
                user: user?.email,
                public: publicTask
            })

            setInputValue("");
            setPublicTask(false);
        } catch (err) {
            console.log(err)
        }
    }

    async function handleShare(id: string) {
        let urlTarefa = `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        await navigator.clipboard.writeText(
            urlTarefa
        )

        alert(`${urlTarefa} copiado para o clipboard.`)
    }

    async function handleDelete(id: string) {
        const docRef = doc(db, "tarefas", id)

        await deleteDoc(docRef)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>
                            Qual a sua próxima tarefa?
                        </h1>
                        <form onSubmit={handleRegisterTask}>
                            <TextArea placeholder='Digite aqui a sua tarefa' value={inputValue} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)} />
                            <div className={styles.checkboxArea}>
                                <input type="checkbox" name="publicTask" id="publicTask" className={styles.checkbox} checked={publicTask} onChange={handleChangePublic} />
                                <label htmlFor="publicTask">Marcar como Tarefa pública</label>
                            </div>
                            <button type="submit" className={styles.button}>
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>
                    {tasks.map(task => (
                        <article className={styles.task} key={task.id}>
                            {task.public && (
                                <div className={styles.tagContainer}>
                                    <label htmlFor="" className={styles.tag}>PUBLICO</label>
                                    <button className={styles.shareBtn} onClick={() => handleShare(task.id)}>
                                        <FiShare2 size={22} color={"#3283ff"} />
                                    </button>
                                </div>
                            )
                            }

                            <div className={styles.taskContent}>
                                {task.public ? (
                                    <Link href={`/task/${task.id}`}>
                                        <p>{task.tarefa}</p>
                                    </Link>
                                ) : (
                                    <p>{task.tarefa}</p>
                                )}
                                <button className={styles.trashBtn} onClick={() => handleDelete(task.id)}>
                                    <FaTrash size={24} color='#EA3140' />
                                </button>
                            </div>
                        </article>
                    ))
                    }

                </section>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {
            user: {
                email: session?.user.email
            }
        }
    }
}