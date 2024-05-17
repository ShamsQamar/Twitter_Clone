import React, { useEffect, useState } from 'react'
import '../Feed/Post/Post.css';
import { Avatar, Box, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase_init';
import axios from 'axios';
import DoneIcon from '@mui/icons-material/Done';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
const Notifications = ({ setAlert }) => {

  const [unread, setUnread] = useState([]);
  const [contents, setContents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [runcount, setRuncount] = useState(0);
  const [empty, setEmpty] = useState(false);
  const [menuContent, setMenuContent] = useState({});
  const user = useAuthState(auth);
  const [loggedInUser] = useLoggedInUser();
  const {t} = useTranslation();
  const { nothing, dont, liked, disliked, likey, dislikey, last, comy, com } = t("notification")

  const userEmail = user[0].email ? user[0].email : loggedInUser.email;
  // console.log(userEmail)

  const handleClick = (e,n) => {
    setMenuContent(n);
    setAnchorEl(e.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const muteUser = async () => {
    handleClose();
    const email = menuContent.email;
    const name = menuContent.firstName;
    console.log(name,email);
    const user = { email: email };
    let res = await axios.patch(`http://localhost:5000/muteUser/${userEmail}`, user);
    console.log(res.data);
    const notify = res.data.message === 'already muted' ? `${name} is already muted` : `notifications from ${name} are muted`;
    toast(notify, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' }, icon: '🔔' });
  }

  const getAllNotifications = async () => {
    if (userEmail) {
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
    if (loggedInUser.name) setBody();
  }

  const setBody = () => {

    if (contents.length === 0) {

      unread.forEach(element => {
        if (element.postUser === loggedInUser.name) {
          if (element.action === 'commented' || 'liked') {
            const forLike = element.notifyBody.toLowerCase().includes('disliked') ? `${dislikey}` : `${likey}`;
            const c = element.action === 'commented' ? `${comy}` : forLike;
            const newCon = {
              firstName: element.name,
              content: c,
              secondName: '',
              date: element.date,
              profileImage: element.profileImage,
              email: element.email
            }
            // console.log('apna',newCon);
            contents.push(newCon);
          }
        } else if (element.action === 'commented' || 'liked') {
          const forLike = element.notifyBody.toLowerCase().includes('disliked') ? `${disliked}` : `${liked}`;
          const c = element.action === 'commented' ? `${com}` : forLike;
          const newCon = {
            firstName: element.name,
            content: c,
            secondName: element.postUser,
            date: element.date,
            profileImage: element.profileImage,
            email: element.email
          }
          // console.log("dusra",newCon);
          contents.push(newCon);
        } else {
          const c = element.notifyBody.replace(element.name, '');
          const newCon = {
            firstName: element.name,
            content: c,
            secondName: '',
            date: element.date,
            profileImage: element.profileImage,
            email: element.email
          }
          // console.log('coverpro',newCon);
          contents.push(newCon);
        }
      })
      // console.log('finalContents', contents)
    }
    else if (unread.length === contents.length + 1) {
      console.log('new notify')
      if (unread[0].postUser === loggedInUser.name) {
        if (unread[0].action === 'commented' || 'liked') {
          const c = unread[0].action === 'commented' ? `${comy}` : `${likey}`;
          const newCon = {
            firstName: unread[0].name,
            content: c,
            secondName: '',
            date: unread[0].date,
            profileImage: unread[0].profileImage,
            email: unread[0].email
          }
          // console.log('apna',newCon);
          contents.unshift(newCon);
        }
      } else if (unread[0].action === 'commented' || 'liked') {
        const c = unread[0].action === 'commented' ? `${com}` : `${liked}`;
        const newCon = {
          firstName: unread[0].name,
          content: c,
          secondName: unread[0].postUser,
          date: unread[0].date,
          profileImage: unread[0].profileImage,
          email: unread[0].email
        }
        // console.log("dusra",newCon);
        contents.unshift(newCon);
      } else {
        const c = unread[0].notifyBody.replace(unread[0].name, '');
        const newCon = {
          firstName: unread[0].name,
          content: c,
          secondName: '',
          date: unread[0].date,
          profileImage: unread[0].profileImage,
          email: unread[0].email
        }
        // console.log('coverpro',newCon);
        contents.unshift(newCon);
      }
      console.log("end")
    }
    setAlert(false);
    setRuncount(runcount + 1)
    // console.log('run', runcount)
    if (runcount > 3 && contents.length === 0) {
      // console.log('runtimes', runcount);
      setEmpty(true)
    }
  }

  useEffect(() => {
    getAllNotifications();
  }, [loggedInUser])


  return (
    <div className="profilePage">
      <div className="post__body">
        {contents.length > 0 ?
          contents.map((n, i) =>
          (
            <div className="post2" key={i + 1}>
              <div className="post__avatar2">
                <Avatar src={n.profileImage} sx={{ width: 30, height: 30 }} />
              </div>

              <div className="post__header2">
                <div className="post__headerText2" key={i + 1} >

                  <section className="post__headerText3" >
                    <h3>{n.firstName}</h3><span>{n.content}</span><h3 style={{ marginLeft: '4px' }}>{n.secondName}</h3>
                    {n.secondName !== '' && <span style={{ marginLeft: 4 }}>{last}</span>}


                    <IconButton size="small"
                      sx={{ ml: 0, pl: 6, pr: 0, pt: 2, mr: 0, color: 'black', "&:hover": { backgroundColor: 'transparent' } }} aria-controls={openMenu ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      onClick={(e) => handleClick(e,n)}><MoreVertRoundedIcon /></IconButton>

                  </section>

                  <span className='date' key={i + 1}>{n.date}</span>
                </div>
              </div>
            </div>
          )
          )
          : empty ?
            <section className="empty">
              <h3>{nothing}</h3>
              <span>{dont}</span>
            </section>
            :
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '45%', minHeight: '100vh', width: '580px' }}>
              <CircularProgress style={{ color: '#50b7f5' }} />
            </Box>

        }
        {contents.length > 0 &&
          <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
            <MenuItem className="Profile__info1">
              <Avatar src={menuContent.profileImage ? menuContent.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
              <div >
                <div className="user__info subUser__info">
                  <h4>
                    {menuContent.firstName}
                  </h4>
                </div>
                <ListItemIcon className="done__icon" color="blue"><DoneIcon /></ListItemIcon>
              </div>
            </MenuItem>
            <Divider />
            {/* <MenuItem onClick={handleClose}>Add an existing account</MenuItem> */}
            <MenuItem onClick={muteUser}>Mute<span className='username'>@{String(menuContent.email).split('@')[0]}</span></MenuItem>
          </Menu>
        }
      </div>
    </div>
  )
}

export default Notifications