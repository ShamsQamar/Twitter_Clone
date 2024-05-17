import { Avatar, Divider, IconButton, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VerifiedUserIcon from '@mui/icons-material/Verified';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PublishIcon from '@mui/icons-material/Publish';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import './Post.css'
import axios from 'axios';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Post = ({ p, tokens, loggedInUserToken, posts, setOtherUser, registerNames }) => {

    const { name, username, post, photo, profileImage, email } = p;
    const [loggedInUser] = useLoggedInUser();
    const [postUserName, setPostUserName] = useState();

    const [postComments, setPostComments] = useState([]);
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [run, setRun] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [like, setLike] = useState();
    const openMenu = Boolean(anchorEl);

    let notifyfor = ''
    let mutedUser = loggedInUser.muted ? loggedInUser.muted.includes(email) : false;
    const navigate = useNavigate();
    const {t} = useTranslation();
    const { liked, disliked, com, co, last, lk, dk } = t("notification");
    const postContent = t("post");
   

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    useEffect(() => {
        if (run < posts.length * 20) {
            // console.log('running', run)
            setLike(p.likes.includes(loggedInUser.email) ? true : false)
            setRun(run + 1)
        } else { console.log('stopped') }
    }, [run])

    const unmuteUser = async (email, name) => {
        handleClose();
        const user = { email: email };
        try {
            let res = await axios.patch(`http://localhost:5000/unmuteUser/${loggedInUser.email}`, user);
            console.log(res.data);
            const notify = res.data.message === 'never muted' ? `${name} was never muted` : `notifications from ${name} are visible now`;
            toast(notify, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
        } catch (error) {
            toast.error(error.message, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
            console.log(error)
        }
    }

    const handleDeletePost = async () => {
        setAnchorEl(null);
        try {
            let res = await axios.patch(`http://localhost:5000/deletePost/${p._id}`);
            console.log(res.data);
            toast('post deleted successfully', { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
            navigate('/feed');
        } catch (error) {
            toast.error(error.message, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
            console.log(error)
        }
    }

    const addNotification = async (p, notifyfor) => {
        let n = new Date();
        let currentDate = n.toLocaleString("en-IN");
        const sameUser = loggedInUser.email === p.email;
        const forComment = sameUser ? `${loggedInUser.name} commented on own post`
            : `${loggedInUser.name} commented on ${p.name}'s post`;
        let forLike = '';
        if (!like) {
            // console.log('actually it is true')
            forLike = sameUser ? `${loggedInUser.name} liked own post`
                : `${loggedInUser.name} liked ${p.name}'s post`;
        } else {
            // console.log('actually it is false')
            forLike = sameUser ? `${loggedInUser.name} disliked own post`
                : `${loggedInUser.name} disliked ${p.name}'s post`;
        }

        const notifyBody = notifyfor === 'like' ? forLike : forComment;
        // console.log(currentDate);
        const newNotification = {
            name: loggedInUser.name,
            email: loggedInUser.email,
            profileImage: loggedInUser.profileImage,
            postUser: p.name,
            postEmail: p.email,
            post: p.post,
            date: currentDate,
            action: notifyfor === 'like' ? 'liked' : 'commented',
            notifyBody: notifyBody
        }
        console.log(newNotification);
        if (showComments) {
            newNotification.comment = comment;
        }
        try {
            const { data } = await axios.post("http://localhost:5000/notification", newNotification);
            console.log(data);
        } catch (error) {
            console.log("error in notification", error);
        }
    }

    const sendNotification = async (p) => {
        const sameUser = loggedInUser.email === p.email;
        const forComment = sameUser ? `${loggedInUser.name} ${co}`
            : `${loggedInUser.name} ${com} ${p.name} ${last}`;
        let forLike = '';
        if (!like) {
            // console.log('actually it is true')
            forLike = sameUser ? `${loggedInUser.name} ${lk}`
                : `${loggedInUser.name} ${liked} ${p.name} ${last}`;
        } else {
            // console.log('actually it is false')
            forLike = sameUser ? `${loggedInUser.name} ${dk}`
                : `${loggedInUser.name} ${disliked} ${p.name} ${last}`;
        }
        const notifyBody = notifyfor === 'like' ? forLike : forComment;
        // console.log('tokens', tokens)
        const filteredTokens = tokens.filter(token => {
            return token !== loggedInUserToken
        })
        // console.log('filtered',filteredTokens);
        const data = {
            actionBy: p.email,
            tokens: filteredTokens,
            title: notifyfor === 'like' ? 'Someone liked' : 'Someone commented',
            body: notifyBody,
            language: language
        }
        console.log(data);
        const res = await axios.post("http://localhost:5000/send", data);
        console.log(res);
    }

    const addLikes = async () => {
        console.log(p.likes)
        const alreadyLiked = p.likes ? p.likes.includes(loggedInUser.email) : false;
        console.log(alreadyLiked)
        notifyfor = 'like'
        const user = { email: loggedInUser.email };
        if (alreadyLiked) {
            if (like) {   //opposite
                let res = await axios.patch(`http://localhost:5000/removeLike/${p._id}`, user);
                console.log(res.data)
                setLike(false);
                addNotification(p, notifyfor);
                sendNotification(p, notifyfor);
                console.log("disliked");
            } else {
                setLike(true)
                sendNotification(p, notifyfor)
                console.log('already liked before');
            }
        } else if (like) {   //opposite
            let res = await axios.patch(`http://localhost:5000/removeLike/${p._id}`, user);
            console.log(res.data)
            setLike(false);
            addNotification(p, notifyfor);
            sendNotification(p, notifyfor);
            console.log("disliked");
        } else {
            let res = await axios.patch(`http://localhost:5000/addLike/${p._id}`, user);
            console.log(res.data)
            setLike(true)
            addNotification(p, notifyfor);
            sendNotification(p, notifyfor)
            console.log('liked');
        }
    }

    const getComments = () => {
        // console.log(postComments)
        if (showComments) {
            setShowComments(false);
        }
        else {
            setShowComments(true);
            setPostComments(p.comments);
        }
    }

    const handleComment = async () => {
        const user = {
            name: loggedInUser.name,
            email: loggedInUser.email,
            username: loggedInUser.username,
            profileImage: loggedInUser.profileImage,
            comment: comment
        };
        console.log(user)
        try {
            let res = await axios.patch(`http://localhost:5000/addComment/${p._id}`, user);
            console.log(res.data)
            setComment('');
            console.log(res.data.comments)
            setPostComments(res.data.comments);
            addNotification(p);
            sendNotification(p);
        } catch (error) {
            toast.error(error.message, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
            setComment('');
        }

    }

    const navTo = async (email) => {
        handleClose();
        const res = await axios.get(`http://localhost:5000/loggedInUser?email=${email}`)
        // console.log(res.data)
        setOtherUser(res.data);
        navigate('/otherProfile', { state: { tokens: tokens, loggedInUserToken: loggedInUserToken, postUserName } });
    }


    const language = localStorage.getItem('i18nextLng')
    useEffect(() => {
        if (name) {
            if (registerNames.includes(name)) {
                const i = registerNames.indexOf(name);
                const allNames = t("users")
                if(i === 0) setPostUserName(allNames.name1);
                if(i === 1) setPostUserName(allNames.name2);
                if(i === 2) setPostUserName(allNames.name3);
                if(i === 3) setPostUserName(allNames.name4);
            }
        }
    },[language])

    return (
        <div className="post">
            <div className="post__avatar">
                <Avatar src={profileImage} />
            </div>
            <div className="post__body">

                <IconButton sx={{ ml: 50, mt: 1, color: 'black' }} aria-controls={openMenu ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClick}
                >
                    <MoreVertRoundedIcon /></IconButton>
                <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
                    {loggedInUser.email === email ?
                        <MenuItem onClick={handleDeletePost}>{postContent.delete}</MenuItem>
                        :
                        <div>
                            <MenuItem onClick={() => navTo(email)}>{postContent.view}</MenuItem>
                            <Divider />
                            {mutedUser ?
                                <MenuItem onClick={() => unmuteUser(email, name)}>{postContent.unmute}<span className='username'>@{email.split('@')[0]}</span></MenuItem>
                                :
                                <MenuItem style={{color: 'grey'}}>{postContent.unmute}<span style={{marginLeft: '4px'}}>@{email.split('@')[0]}</span></MenuItem>
                            }
                        </div>
                    }
                </Menu>

                <div className='post-header'>
                    <div className="post__headerText">
                        <h3>{postUserName ? postUserName : name }{" "}
                            <span className="post__headerSpecial">
                                <VerifiedUserIcon className="post__badge" /> @{username}
                            </span>
                        </h3>
                    </div>
                    <div className="post__headerDescription">
                        <p>{post}</p>
                    </div>
                </div>
                <img src={photo} alt="" width='500' />
                <div className="post__footer">
                    {showComments ?
                        <ChatBubbleRoundedIcon className="post__footer__icon__active" fontSize="small" onClick={getComments} />
                        :
                        <ChatBubbleOutlineIcon className="post__footer__icon" fontSize="small" onClick={getComments} />
                    }
                    <RepeatIcon className="post__footer__icon" fontSize="small" />
                    {like ?
                        <FavoriteRoundedIcon className="post__footer__icon__active" fontSize="small" onClick={addLikes} />
                        :
                        <FavoriteBorderIcon className="post__footer__icon" fontSize="small" onClick={addLikes} />
                    }
                    <PublishIcon className="post__footer__icon" fontSize="small" />
                </div>
                {showComments &&
                    <div>
                        {postComments.length > 0 ?
                            postComments.map((c, i) =>
                            (
                                <div className="post2" key={i + 1}>
                                    <div className="post__avatar2">
                                        <Avatar src={c.profileImage} sx={{ width: 30, height: 30 }} />
                                    </div>

                                    <div className="post__header">
                                        <div className="post__headerText2">
                                            <h3>{c.name}</h3>
                                            <div key={i + 1} >{c.comment}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                            )
                            : <span className="no-comments">{postContent.noc}</span>
                        }
                        <div className='add-comment'>
                            <input
                                type="text"
                                placeholder= {postContent.wtc}
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                className='input-comment'
                            />
                            {comment &&
                                <SendRoundedIcon className='send-icon' onClick={handleComment} />
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Post