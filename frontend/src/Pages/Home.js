import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import Widgets from './Widgets/Widgets'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase_init'
import { signOut } from 'firebase/auth'
import useLoggedInUser from '../hooks/useLoggedInUser'
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebase_init';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { useTranslation } from 'react-i18next'

export const Home = ({ alert, setAlert, registerNames, setMyName, myName }) => {

    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const { newn } = t("notification");
    const { last, com, comy, liked, disliked, likey, dislikey, co, lk, dk } = t("notification")
    const { tweeted, cover, dp } = t("toasting");
    const [unread, setUnread] = useState([]);
    const [run, setRun] = useState(0);

    const user = useAuthState(auth);
    const handleLogout = () => {
        signOut(auth);
    }

    const [loggedInUser] = useLoggedInUser();
    const userEmail = user[0].email ? user[0].email : loggedInUser.email;

    const getAllNotifications = async () => {
        if (unread.length === 0 && userEmail) {
            const res = await axios.get(`http://localhost:5000/getNotifications`);
            // console.log("response data", res.data)
            let allNotifications = res.data;
            let filterd = allNotifications.filter((item) => {
                return item.postEmail !== item.email
            })
            // console.log(filterd)

            const avoidMyAction = filterd.filter(n => {
                return n.email !== userEmail
            })
            // console.log("avoid", avoidMyAction)
            let unmutedUser = [];
            if (loggedInUser.muted) {
                unmutedUser = avoidMyAction.filter((item) => {
                    return !loggedInUser.muted.includes(item.email)
                })
                // console.log('unmuted', unmutedUser);
            }
            const finalFilter = loggedInUser.muted ? unmutedUser : avoidMyAction;
            setUnread(finalFilter)
        }
        // else { console.log("unread already stored") }
        if (run < 3) setRun(run + 1);
        if (loggedInUser.name && run === 2 && unread.length > 0) {
            console.log("run", run)
            toastNotify();
        }
    }

    const toastNotify = () => {
        console.log("UnreadLength", unread.length);
        if (unread.length === 1) {
            const myPost = unread[0].postUser === loggedInUser.name;
            const toastIt = myPost ? unread[0].notifyBody.replace(loggedInUser.name + "'s", 'your') : unread[0].notifyBody;
            toast(toastIt, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
        } else if (unread.length > 1) {
            const count = unread.length;
            const toastIt = `${count} ${newn}`;
            toast(toastIt, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
        }
    }

    const handleLngConflict = (payload) => {
        let newBody = ''
        const newLngData = i18n.getDataByLanguage(payload.data.language).translation.notification;
        const otherData = i18n.getDataByLanguage(payload.data.language).translation.toasting;
        // console.log(newLngData);
        if (payload.data.actionBy === userEmail) {
            if (payload.notification.body.includes(newLngData.com)) {
                newBody = payload.notification.body.replace(newLngData.com + ' ' + loggedInUser.name + ' ' + newLngData.last, newLngData.comy);
                // console.log(newBody)
                newBody = newBody.replace(newLngData.comy, comy);
                // console.log(newBody)
            }
            else if (payload.notification.body.includes(newLngData.disliked)) {
                newBody = payload.notification.body.replace(newLngData.disliked + ' ' + loggedInUser.name + ' ' + newLngData.last, newLngData.dislikey);
                // console.log(newBody)
                newBody = newBody.replace(newLngData.dislikey, dislikey);
                // console.log(newBody)
            } else {
                newBody = payload.notification.body.replace(newLngData.liked + ' ' + loggedInUser.name + ' ' + newLngData.last, newLngData.likey);
                // console.log(newBody)
                newBody = newBody.replace(newLngData.likey, likey);
                // console.log(newBody)
            }
            toast(newBody, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
            setAlert(true);
        } else {
            if (payload.notification.body.includes(newLngData.co)) {
                newBody = payload.notification.body.replace(newLngData.co, co);
                // console.log(newBody)
            } else if (payload.notification.body.includes(newLngData.dk)) {
                newBody = payload.notification.body.replace(newLngData.dk, dk);
                // console.log(newBody)
            }
            else if (payload.notification.body.includes(newLngData.lk)) {
                newBody = payload.notification.body.replace(newLngData.lk, lk);
                // console.log(newBody)
            }
            else if (payload.notification.body.includes(otherData.cover)) {
                newBody = payload.notification.body.replace(otherData.cover, cover);
                // console.log(newBody)
            }
            else if (payload.notification.body.includes(otherData.dp)) {
                newBody = payload.notification.body.replace(otherData.dp, dp);
                // console.log(newBody)
            }
            else {
                newBody = payload.notification.body.replace(otherData.tweeted, tweeted);
                // console.log(newBody)
            }
            toast(newBody, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
            setAlert(true);
        }

    }


    useEffect(() => {
        getAllNotifications();
    }, [loggedInUser])

    useEffect(() => {
        onMessage(messaging, (payload) => {
            // console.log(payload);
            if (payload.data.language !== i18n.language) {
                handleLngConflict(payload);
            } else {
                if (payload.data.actionBy === userEmail) {
                    let newBody = '';
                    if (payload.notification.body.includes(com)) {
                        newBody = payload.notification.body.replace(com + ' ' + loggedInUser.name + ' ' + last, comy);
                        console.log(newBody)
                    }
                    else if (payload.notification.body.includes(liked)) {
                        console.log(liked + ' ' + loggedInUser.name + ' ' + last)
                        newBody = payload.notification.body.replace(liked + ' ' + loggedInUser.name + ' ' + last, likey);
                        console.log(newBody)
                    } else {
                        newBody = payload.notification.body.replace(disliked + ' ' + loggedInUser.name + ' ' + last, dislikey);
                        console.log(disliked + ' ' + loggedInUser.name + ' ' + last)
                        console.log(newBody)
                    }
                    toast(newBody, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
                    setAlert(true);
                } else {
                    toast(payload.notification.body, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
                    setAlert(true);
                }
            }
        })
    }, [run])

    return (
        <div className='app'>
            <Toaster toastOptions={{ duration: 4000 }} />
            <Sidebar handleLogout={handleLogout} user={user} alert={alert} myName={myName} setMyName={setMyName} registerNames={registerNames} />
            <Outlet />
            <Widgets />
        </div>
    )
}
