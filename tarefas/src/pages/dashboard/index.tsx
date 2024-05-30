import styles from './styles.module.css';

import { ChangeEvent, FormEvent, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import { TextArea } from '@/components/textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

export default function Dashboard() {
    const [inputValue, setInputValue] = useState("");
    const [publicTask, setPublicTask] = useState(false);

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target.checked);

        setPublicTask(event.target.checked)
    }

    function handleRegisterTask(event: FormEvent) {
        event.preventDefault();

        if (inputValue == "") return;

        alert("TESTE")
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

                    <article className={styles.task}>
                        <div className={styles.tagContainer}>
                            <label htmlFor="" className={styles.tag}>PUBLICO</label>
                            <button className={styles.shareBtn}>
                                <FiShare2 size={22} color={"#3283ff"} />
                            </button>
                        </div>
                        <div className={styles.taskContent}>
                            <p>Minha primeira tarefa de exemplo. Show Demais!</p>
                            <button className={styles.trashBtn}>
                                <FaTrash size={24} color='#EA3140' />
                            </button>
                        </div>
                    </article>
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
        props: {}
    }
}