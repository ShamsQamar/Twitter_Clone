import { useEffect, useState } from 'react'
import './MainProfile.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useLocation, useNavigate } from 'react-router-dom';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import Post from '../../Feed/Post/Post';
import axios from 'axios';

const OthersProfile = ({ otherUser, registerNames }) => {

    const [loggedInUser] = useLoggedInUser();

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const tokens = location.state.tokens;
    const loggedInUserToken = location.state.loggedInUserToken
    const postUserName = location.state.postUserName;

    const getAllPosts = async () => {
        // console.log(otherUser.email)
        let res = await axios.get(`http://localhost:5000/userPost?email=${otherUser.email}`);
        // console.log(res.data)
        setPosts(res.data)
    }

    useEffect(() => {
        getAllPosts();
    }, [loggedInUser.email])


    return (
        <div className='profilePage'>
            <div>
                <ArrowBackIcon className='arrow-icon' onClick={() => navigate('/')} />
                <h4 className='heading-4'>{otherUser.username}</h4>
                <div className='mainprofile' >
                    <div className='profile-bio'>
                        {
                            <div >
                                <div className='coverImageContainer'>
                                    <img src={otherUser.coverImage ? otherUser.coverImage : 'https://www.proactivechannel.com/Files/BrandImages/Default.jpg'} alt="" className='coverImage' />
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='avatar-img'>
                                    <div className='avatarContainer'>
                                        <img src={otherUser.profileImage ? otherUser.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} className="avatar" alt='' />
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
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='userInfo'>
                                        <div>
                                            <h3 className='heading-3'>
                                            {postUserName ? postUserName : otherUser.name}
                                            </h3>
                                            <p className='usernameSection'>@{otherUser.username}</p>
                                        </div>
                                    </div>
                                    <div className='infoContainer'>
                                        {otherUser.bio ? <p>{otherUser.bio}</p> : ''}
                                        <div className='locationAndLink'>
                                            {otherUser.location ? <p className='subInfo'><MyLocationIcon /> {otherUser.location}</p> : ''}
                                            {otherUser.website ? <p className='subInfo link'><AddLinkIcon /> {otherUser.website}</p> : ''}
                                        </div>
                                    </div>
                                    <h4 className='tweetsText'>Tweets</h4>
                                    <hr />
                                </div>
                                {
                                    posts.map(post => <Post key={post._id} p={post} posts={posts} tokens={tokens} loggedInUserToken={loggedInUserToken} registerNames={registerNames}/>)
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OthersProfile;