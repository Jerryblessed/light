"use client";
import Image from 'next/image'
import styles from './page.module.css'
import Video from "@/app/video";

export default function Home() {
    return (
        <main className={styles.main}>

            <div style={{ borderTop: '1px solid var(--primary-color)', width: '100%' }}></div>
            <Video></Video>
        </main>
    );
}

