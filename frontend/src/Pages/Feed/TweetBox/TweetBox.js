import React, { useState } from 'react'
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase_init';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import { useTranslation } from 'react-i18next';

const TweetBox = ({ tokens, loggedInUserToken }) => {

    const [post, setPost] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState();
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [loggedInUser] = useLoggedInUser();

    const [user] = useAuthState(auth);
    const email = user.email ? user.email : loggedInUser.email;
    const useProfilePic = loggedInUser.profileImage ? loggedInUser.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const tweet = t("tweet");
    const {tweeted} = t("toasting");
    const uimg = t("uimg");
    const imgu = t("img");
    const happening = t("happening");

    const sendNotification = async () => {
        const notifyBody = `${loggedInUser.name} ${tweeted}`
        const filteredTokens = tokens.filter(token => {
            return token !== loggedInUserToken
        })
        console.log(filteredTokens);
        const data = {
            actionBy: '',
            tokens: filteredTokens,
            title: 'New tweet',
            body: notifyBody,
            language: i18n.language
        }
        console.log(data);
        const res = await axios.post("http://localhost:5000/send", data);
        console.log(res);
    }


    const handleUploadImage = async (e) => {
        setIsLoading(true);
        const image = e.target.files[0];

        const formData = new FormData();
        formData.set('image', image);

        try {
            const res = await axios.post('https://api.imgbb.com/1/upload?key=d45c8ba3284caec5bdddcf58c3d8408d', formData)
            setImageURL(res.data.data.display_url);
            console.log(res.data.data.display_url);
            setIsLoading(false);
        } catch (error) {
            console.log("error while uploading image", error);
            setIsLoading(false);
        }
    }


    const handleTweet = async (e) => {
        e.preventDefault();
        const username = email.split('@')[0];
        setUserName(username);
        if (user.providerData[0].providerId === 'google') setName(user.displayName);
        else setName(loggedInUser.name);

        if (name) {
            const userPost = {
                post: post,
                photo: imageURL,
                name: name,
                username: userName,
                email: email,
                profileImage: useProfilePic,
                comments: [],
                likes: []
            }
            console.log(userPost);
            setPost('');
            setImageURL('')

            fetch('http://localhost:5000/post', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userPost)
            }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    sendNotification();
                })
        }
    }

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox__input">
                    <Avatar src={loggedInUser.profileImage ? loggedInUser.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
                    <input
                        type="text"
                        placeholder={happening}
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        required
                    />

                </div>
                <div className="imageIcon_tweetButton">
                    <label htmlFor='image' className="imageIcon">
                        {
                            isLoading ? <p>{uimg}</p> : <p>{imageURL ? `${imgu}` : <AddPhotoAlternateOutlinedIcon />}</p>
                        }
                    </label>
                    <input
                        type="file"
                        id='image'
                        className="imageInput"
                        onChange={handleUploadImage}
                    />
                    <Button className="tweetBox__tweetButton" type="submit">{tweet}</Button>
                </div>
            </form>
        </div>
    )
}

export default TweetBox