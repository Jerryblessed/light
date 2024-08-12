import React, { useState } from 'react';
import { connect } from 'react-redux';
import AuthContainer from '../components/AuthContainer';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import BaseLayout from '../components/BaseLayout';
import styles from '../styles/Dashboard.module.css';
import JoinModal from '../components/JoinModal';
import HostModal from '../components/HostModal';
// import Footer from '../components/Footer';

const Dashboard = ({ isDarkMode }) => {
    // State to manage modals
    const [joinModalShow, setJoinModalShow] = useState(false);
    const [hostModalShow, setHostModalShow] = useState(false);

    return (
        <BaseLayout>
            <AuthContainer>
                <Navbar />

                {/* Dashboard Cards */}
                <div className={`${styles.cards} ${isDarkMode ? styles.cardsDark : ""}`}>


                    {/* Chat */}
                    <Link href="/chat">
                        <div className={`${styles.card} ${styles.lightChat}`}>
                            <img className={styles.cardImage} src='/static/images/light-bulb-idea-svgrepo-com.svg' />
                            <div className={styles.cardText}> Light chat</div>
                        </div>
                    </Link>


                    {/* Course Items */}

                    <Link href="/course">

                        <div className={`${styles.card} ${styles.course}`}>
                            <img className={styles.cardImage} src='/static/images/books-svgrepo-com.svg' />
                            <div className={styles.cardText}>Choose course now</div>
                        </div>
                    </Link>


                    <Link href="https://colab.research.google.com/github/GoogleCloudPlatform/generative-ai/blob/main/vision/getting-started/imagen3_image_generation.ipynb">
                        <a target="_blank" rel="noopener noreferrer">
                            <div className={`${styles.card} ${styles.imageupload}`}>
                                <img className={styles.cardImage} src='/static/images/picture-photo-svgrepo-com.svg' alt="Image Gen" />
                                <div className={styles.cardText}>Image Generation</div>
                            </div>
                        </a>
                    </Link>

                    <Link href="https://drive.google.com">
                        <a target="_blank" rel="noopener noreferrer">
                            <div className={`${styles.card} ${styles.drivelink}`}>
                                <img className={styles.cardImage} src='/static/images/drive-svgrepo-com.svg' alt="Image Gen" />
                                <div className={styles.cardText}>Goto Google Drive</div>
                            </div>
                        </a>
                    </Link>



                    {/* Video Upload */}
                    <Link href="/video">
                        <div className={`${styles.card} ${styles.postvideo}`}>
                            <img className={styles.cardImage} src='/static/images/video-player-film-svgrepo-com.svg' />
                            <div className={styles.cardText}>Upload course items</div>
                        </div>
                    </Link>

                    {/* Meetings */}
                    <div className={`${styles.card} ${styles.joinCard}`} onClick={() => { setHostModalShow(false); setJoinModalShow(true); }}>
                        <img className={styles.cardImage} src='/static/images/join-meet.svg' />
                        <div className={styles.cardText}>Join a Meeting</div>
                    </div>
                    <div className={`${styles.card} ${styles.hostCard}`} onClick={() => { setJoinModalShow(false); setHostModalShow(true); }}>
                        <img className={styles.cardImage} src='/static/images/host-meet.svg' />
                        <div className={styles.cardText}>Host a Meeting</div>
                    </div>
                    <Link href="/meetings">
                        <div className={`${styles.card} ${styles.myMeetingsCard}`}>
                            <img className={styles.cardImage} src='/static/images/my-meetings.svg' />
                            <div className={styles.cardText}>My Meetings</div>
                        </div>
                    </Link>

                </div>

                {/* Modals */}
                <JoinModal show={joinModalShow} onClose={() => { setJoinModalShow(false); }} />
                <HostModal show={hostModalShow} onClose={() => { setHostModalShow(false); }} />
                {/* <Footer /> */}
            </AuthContainer>
        </BaseLayout>
    )
}

const mapStateToProps = ({ theme }) => ({
    isDarkMode: theme.isDarkMode
});

export default connect(mapStateToProps, null)(Dashboard);