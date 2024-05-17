import { useEffect, useState } from 'react'
import './MainProfile.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import Post from '../../Feed/Post/Post';
import axios from 'axios';
import EditProfile from '../EditProfile/EditProfile';
import { useTranslation } from 'react-i18next';

const MainProfile = ({ user, tokens, loggedInUserToken, myName, registerNames }) => {

    const navigate = useNavigate();
    const [loggedInUser] = useLoggedInUser();
    const UserEmail = user.email ? user.email : loggedInUser.email;
    const username = user.email ? user.email.split('@')[0] : String(loggedInUser.email).split('@')[0];
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const language = localStorage.getItem('i18nextLng');
    const { t } = useTranslation();
    const { tweets } = t('profile')
    const {dp, cover} = t("toasting")

    const getAllPosts = async () => {
        let res = await axios.get(`http://localhost:5000/userPost?email=${UserEmail}`);
        // console.log(res.data)
        setPosts(res.data)
    }

    useEffect(() => {
        getAllPosts();
    }, [UserEmail])


    const sendNotification = async (changed) => {
        const notifyBody = changed === 'cover' ? `${loggedInUser.name} ${cover}`
            : `${loggedInUser.name} ${dp}`;
        const filteredTokens = tokens.filter(token => {
            return token !== loggedInUserToken
        })
        console.log(filteredTokens);
        const data = {
            actionBy: '',
            tokens: filteredTokens,
            title: changed === 'cover' ? 'Cover chaged' : 'Profile changed',
            body: notifyBody,
            language: language
        }
        console.log(data);
        const res = await axios.post("http://localhost:5000/send", data);
        console.log(res);
    }

    const handleUploadCoverImage = async (e) => {
        setIsLoading(true);
        const image = e.target.files[0];

        const formData = new FormData();
        formData.set('image', image);

        const res = await axios.post('https://api.imgbb.com/1/upload?key=d45c8ba3284caec5bdddcf58c3d8408d', formData)
        const url = res.data.data.display_url
        const userCoverImage = {
            email: loggedInUser.email,
            coverImage: url
        }
        setIsLoading(false);
        if (url) {
            console.log(userCoverImage);
            try {
                await axios.patch(`http://localhost:5000/userUpdates/${loggedInUser.email}`, userCoverImage);
                sendNotification('cover');
            } catch (error) {
                console.log(error);
                setIsLoading(false)
            }
        }
    }

    const handleUploadProfileImage = async (e) => {
        setIsLoading(true);
        const image = e.target.files[0];

        const formData = new FormData();
        formData.set('image', image);

        const res = await axios.post('https://api.imgbb.com/1/upload?key=d45c8ba3284caec5bdddcf58c3d8408d', formData)
        const url = res.data.data.display_url
        const userProfileImage = {
            email: loggedInUser.email,
            profileImage: url
        }
        setIsLoading(false);
        if (url) {
            console.log(userProfileImage);
            try {
                await axios.patch(`http://localhost:5000/userUpdates/${loggedInUser.email}`, userProfileImage);
                sendNotification('profile');
            } catch (error) {
                console.log(error);
                setIsLoading(false)
            }
        }
    }

    return (
        <div>
            <ArrowBackIcon className='arrow-icon' onClick={() => navigate('/')} />
            <h4 className='heading-4'>{username}</h4>
            <div className='mainprofile' >
                <div className='profile-bio'>
                    {
                        <div >
                            <div className='coverImageContainer'>
                                <img src={loggedInUser.coverImage ? loggedInUser.coverImage : 'https://www.proactivechannel.com/Files/BrandImages/Default.jpg'} alt="" className='coverImage' />
                                <div className='hoverCoverImage'>
                                    <div className="imageIcon_tweetButton">
                                        <label htmlFor='image' className="imageIcon">
                                            {
                                                isLoading ?
                                                    <LockResetIcon className='photoIcon photoIconDisabled ' />
                                                    :
                                                    <CenterFocusWeakIcon className='photoIcon' />
                                            }
                                        </label>
                                        <input
                                            type="file"
                                            id='image'
                                            className="imageInput"
                                            onChange={handleUploadCoverImage}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='avatar-img'>
                                <div className='avatarContainer'>
                                    <img src={loggedInUser.profileImage ? loggedInUser.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} className="avatar" alt='' />
                                    <div className='hoverAvatarImage'>
                                        <div className="imageIcon_tweetButton">
                                            <label htmlFor='profileImage' className="imageIcon">
                                                {
                                                    isLoading ?
                                                        <LockResetIcon className='photoIcon photoIconDisabled ' />
                                                        :
                                                        <CenterFocusWeakIcon className='photoIcon' />
                                                }
                                            </label>
                                            <input
                                                type="file"
                                                id='profileImage'
                                                className="imageInput"
                                                onChange={handleUploadProfileImage}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='userInfo'>
                                    <div>
                                        <h3 className='heading-3'>
                                            {myName !== '' ? myName : loggedInUser.name ? loggedInUser.name : user && user.displayName}
                                        </h3>
                                        <p className='usernameSection'>@{username}</p>
                                    </div>
                                    <EditProfile user={user} loggedInUser={loggedInUser} />
                                </div>
                                <div className='infoContainer'>
                                    {loggedInUser.bio ? <p>{loggedInUser.bio}</p> : ''}
                                    <div className='locationAndLink'>
                                        {loggedInUser.location ? <p className='subInfo'><MyLocationIcon /> {loggedInUser.location}</p> : ''}
                                        {loggedInUser.website ? <p className='subInfo link'><AddLinkIcon /> {loggedInUser.website}</p> : ''}
                                    </div>
                                </div>
                                <h4 className='tweetsText'>{tweets}</h4>
                                <hr />
                            </div>
                            {
                                posts.map(post => <Post key={post._id} p={post} posts={posts} registerNames={registerNames} tokens={tokens} loggedInUserToken={loggedInUserToken}/>)
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default MainProfile




// if (payload.data.language !== i18n.language) {
//     const newLngData = i18n.getDataByLanguage(payload.data.language).translation.notification;
//     const otherData = i18n.getDataByLanguage(payload.data.language).translation.toasting;
//     console.log(newLngData);
//     if (payload.data.actionBy === userEmail) {
//         if (payload.notification.body.includes(newLngData.com)) {
//             newBody = payload.notification.body.replace(newLngData.com + ' ' + loggedInUser.name + ' ' + newLngData.last, newLngData.comy);
//             console.log(newBody)
//             newBody = newBody.replace(newLngData.comy, comy);
//             console.log(newBody)
//         }
//         else if (payload.notification.body.includes(newLngData.disliked)) {
//             newBody = payload.notification.body.replace(newLngData.disliked + ' ' + loggedInUser.name + ' ' + newLngData.last, newLngData.dislikey);
//             console.log(newBody)
//             newBody = newBody.replace(newLngData.dislikey, dislikey);
//             console.log(newBody)
//         } else {
//             newBody = payload.notification.body.replace(newLngData.liked + ' ' + loggedInUser.name + ' ' + newLngData.last, newLngData.likey);
//             console.log(newBody)
//             newBody = newBody.replace(newLngData.likey, likey);
//             console.log(newBody)
//         }
//         toast(newBody, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
//         setAlert(true);
//     } else {
//         if (payload.notification.body.includes(newLngData.co)) {
//             newBody = payload.notification.body.replace(newLngData.co, co);
//             console.log(newBody)
//         } else if (payload.notification.body.includes(newLngData.dk)) {
//             newBody = payload.notification.body.replace(newLngData.dk, dk);
//             console.log(newBody)
//         } 
//         else if (payload.notification.body.includes(newLngData.lk)) {
//             newBody = payload.notification.body.replace(newLngData.lk, lk);
//             console.log(newBody)
//         }
//         else if (payload.notification.body.includes(otherData.cover)) {
//             newBody = payload.notification.body.replace(otherData.cover, cover);
//             console.log(newBody)
//         } 
//         else if (payload.notification.body.includes(otherData.dp)) {
//             newBody = payload.notification.body.replace(otherData.dp, dp);
//             console.log(newBody)
//         } 
//         else {
//             newBody = payload.notification.body.replace(otherData.tweeted, tweeted);
//             console.log(newBody)
//         }
//         toast(newBody, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
//         setAlert(true);
//     }
// }


// const { i18n } = useTranslation();
// const { newn } = t("notification");
// const { last, co, comy, liked, disliked, likey, dislikey, lk, dk } = t("notification")
// const { tweeted, cover, dp } = t("toasting");