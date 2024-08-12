

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AuthContainer from '../components/AuthContainer';
import BaseLayout from '../components/BaseLayout';
import Navbar from '../components/Navbar';
import { deleteProfile, getProfile, updateProfile } from '../redux/profile/actions';
import styles from '../styles/Profile.module.css';
import { storage } from '../firebase/firebaseApp';
import Spinner from "../components/Spinner";
import { setAlert } from '../redux/alert/actions';
import DialogBox from '../components/DialogBox';

const Profile = ({ user, profile, getProfile, updateProfile, setAlert, isDarkMode, deleteProfile }) => {
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showDialogBox, setShowDialogBox] = useState(false);

    useEffect(() => {
        getProfileData();
    }, []);

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setImage(profile.image);
        }
    }, [profile]);

    const getProfileData = async () => {
        if (user) {
            await getProfile(user.uid);
        }
    }

    const uploadHandler = () => {
        if (typeof window !== "undefined") {
            const fileInput = document.querySelector("#file-upload");
            fileInput.addEventListener('change', function () {
                onSelectImage(this);
            });
            fileInput.click();
        }
    }

    const onSelectImage = async (input) => {
        try {
            setUploading(true);
            const file = input.files[0];
            const storageRef = storage.ref();
            const fileRef = storageRef.child(file.name);
            await fileRef.put(file);
            const url = await fileRef.getDownloadURL();
            setImage(url);
            setUploading(false);
            setAlert('Image uploaded', 'success');
        } catch (error) {
            console.log(error);
            setAlert("Failed to upload file", "danger");
        }
    }

    const onSubmitHandler = async () => {
        if (!name) {
            setAlert("Name can't be empty");
            return;
        }
        await updateProfile(profile.uid, image ? { name, image } : { name });
        setEdit(false);
    }

    const onDeleteHandler = async () => {
        await deleteProfile(profile.uid);
    }

    return (
        <BaseLayout>
            <AuthContainer>
                {!profile ? <Spinner /> : <>
                    <Navbar />

                    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                        <iframe
                            src="https://gemini-chat-eight-bice.vercel.app/

"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="Yo.com"
                        />
                    </div>

                </>}
            </AuthContainer>
        </BaseLayout>
    )
}

const mapStateToProps = ({ auth, profile, theme }) => ({
    user: auth.user,
    profile: profile.data,
    isDarkMode: theme.isDarkMode
})

export default connect(mapStateToProps, { getProfile, updateProfile, setAlert, deleteProfile })(Profile);
