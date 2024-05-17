import React, { useEffect, useState, useTransition } from 'react'
import './Sidebar.css'
import TwitterIcon from '@mui/icons-material/Twitter';
import SidebarOptions from './SidebarOptions';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MoreIcon from '@mui/icons-material/More';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close'
import PhoneIcon from '@mui/icons-material/Phone';
import CircularProgress from '@mui/material/CircularProgress';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import { Avatar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Modal, Box, FormControl, InputLabel, Select, colors } from '@mui/material';
import CustomeLink from './CustomeLink';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { useTranslation } from 'react-i18next';
import OTPInput from "otp-input-react";
import PhoneInput from 'react-phone-input-2'
import toast from 'react-hot-toast';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import auth from '../../firebase_init';
import axios from 'axios';

const Sidebar = ({ handleLogout, user, alert, myName, setMyName, registerNames }) => {

    const { t } = useTranslation();
    const { home, explore, notifications, messages, bookmarks, lists, profile, more } = t("sidebar");
    const tweet = t("tweet");
    const { change, logout } = t("sidebar");
    const { verify, selecto, enter, vo, enterp, sendo, morelng, ch } = t("changemodal");
    const { i18n } = useTranslation();

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [loggedInUser] = useLoggedInUser();
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState(i18n.language);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [ph, setPh] = useState('');
    const [showSelect, setShowSelect] = useState(false)
    // console.log("home", loggedInUser)
    // const itsMe = t("users",{ name: loggedInUser.name });
    // console.log('t',t)
    // console.log(itsMe)
    const languages = [
        { code: "en", lang: "English" },
        { code: "hi", lang: "Hindi" },
        { code: "fr", lang: "French" } 
    ];
    const currentLangCode = localStorage.getItem("i18nextLng");

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 0,
    };

    const verifyOTP = () => {
        setLoading(true);
        window.confirmationResult.confirm(otp)
            .then(res => {
                console.log(res);
                setShowSelect(true);
                setLoading(false);
            }).catch(error => {
                console.log(error)
                setOtp('')
                toast.error(error.message, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
                setLoading(false);
            })
    }

    const onCaptchVerify = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log('reCAPTCHA solved');
            },
        });
    }

    const sendOTP = async () => {
        if (!ph || '') return toast.error("Please enter the phone number first", { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/phoneUser?phone=${ph}`);
        console.log(res)

        // console.log(window.recaptchaVerifier);
        if (!window.recaptchaVerifier) {
            auth.settings.appVerificationDisabledForTesting = true;
        } else auth.settings.appVerificationDisabledForTesting = false;

        onCaptchVerify();
        let appVerifier = window.recaptchaVerifier;
        const formatPh = '+' + ph;


        if (res.data.email === loggedInUser.email) {
            signInWithPhoneNumber(auth, formatPh, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    window.confirmationResult = confirmationResult;
                    // console.log(confirmationResult)
                    setShowOTP(true);
                    setLoading(false);
                    toast.success("OTP sent successfully", { style: { boxShadow: 'none', fontSize: '15px' } });
                }).catch((error) => {
                    // Error; SMS not sent
                    console.log(error)
                    // appVerifier.render();
                    toast.error(error.message, { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
                    setShowOTP(false);
                    setLoading(false)
                });
            // appVerifier.render();
        } else {
            toast.error("Please verify with your own phone number", { style: { background: 'skyblue', boxShadow: 'none', fontSize: '15px' } });
            setLoading(false);
            // setPh('');
            setOtp('');
        }
    }


    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const changeLang = () => {
        handleClose()
        setOpen(true)
        // const l = localStorage.getItem("i18nextLng");
        // const toggle = l === 'hi' ? 'en' : 'hi';
        // i18n.changeLanguage(toggle)
    }

    const handleLangChange = (e) => {
        // console.log(e.target.value)
        const lng = e.target.value;
        setLang(lng)
    }

    const saveLang = () => {
        i18n.changeLanguage(lang);
        setOpen(false);
        setShowOTP(false);
        setPh('');
        setOtp('')
        setShowSelect(false)
    }

    const closeAll = () => {
        setOpen(false);
        setShowOTP(false);
        setPh('');
        setOtp('')
    }

    const username = user[0].email ? user[0].email.split('@')[0] : String(loggedInUser.email).split('@')[0];

    useEffect(() => {
        if (registerNames.includes(loggedInUser.name)) {
            const i = registerNames.indexOf(loggedInUser.name);
            const allNames = t("users")
            // console.log(allNames.name1)
            if (i === 0) setMyName(allNames.name1);
            if (i === 1) setMyName(allNames.name2);
            if (i === 2) setMyName(allNames.name3);
            if (i === 3) setMyName(allNames.name4);
        }
    }, [loggedInUser, i18n.language])

    return (
        <div className="sidebar">
            <TwitterIcon className="sidebar__twitterIcon" />
            <CustomeLink to='/feed'>
                <SidebarOptions active Icon={HomeIcon} text={home} />
            </CustomeLink>
            <CustomeLink to='/explore'>
                <SidebarOptions Icon={SearchIcon} text={explore} />
            </CustomeLink>
            <CustomeLink to='/notifications'>
                {alert ?
                    <SidebarOptions Icon={NotificationsActiveRoundedIcon} text={notifications} alert={alert} />
                    :
                    <SidebarOptions Icon={NotificationsIcon} text={notifications} />
                }
            </CustomeLink>
            <CustomeLink to='/messages'>
                <SidebarOptions Icon={MailOutlineIcon} text={messages} />
            </CustomeLink>
            <CustomeLink to='/bookmarks'>
                <SidebarOptions Icon={BookmarkBorderIcon} text={bookmarks} />
            </CustomeLink>
            <CustomeLink to='/lists'>
                <SidebarOptions Icon={ListAltIcon} text={lists} />
            </CustomeLink>
            <CustomeLink to='/profile'>
                <SidebarOptions Icon={PermIdentityIcon} text={profile} />
            </CustomeLink>
            <CustomeLink to='/more'>
                <SidebarOptions Icon={MoreIcon} text={more} />
            </CustomeLink>
            <Button variant="outlined" className="sidebar__tweet" fullWidth>
                {tweet}
            </Button>
            <div className="Profile__info">
                <Avatar src={loggedInUser.profileImage ? loggedInUser.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
                <div className="user__info">
                    <h4>
                        {myName !== '' ? myName : loggedInUser.name ? loggedInUser.name : user && user[0].displayName}
                    </h4>
                    <h5>@{username}</h5>
                </div>
                <IconButton size="small"
                    sx={{ ml: 2 }} aria-controls={openMenu ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClick}><MoreHorizIcon /></IconButton>
                <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
                    <MenuItem className="Profile__info1">
                        <Avatar src={loggedInUser.profileImage ? loggedInUser.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
                        <div >
                            <div className="user__info subUser__info">
                                <h4>
                                    {myName !== '' ? myName : loggedInUser.name ? loggedInUser.name : user && user[0].displayName}
                                </h4>
                            </div>
                            <ListItemIcon className="done__icon" color="blue"><DoneIcon /></ListItemIcon>
                        </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={changeLang}><LanguageRoundedIcon sx={{ pr: 1, color: 'grey' }} />{change}</MenuItem>
                    <MenuItem onClick={handleLogout}>{logout} @{username}</MenuItem>
                </Menu>
            </div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='modal' >
                    <div className='header'>
                        <IconButton onClick={closeAll} ><CloseIcon /></IconButton>
                        {showSelect ?
                            <>
                                <h2 className='header-title'>{selecto}</h2>
                                <button onClick={saveLang} className='save-btn' >{ch}</button>
                            </>
                            :
                            <h2 className='header-title' style={{ paddingRight: '130px'}} >{verify}</h2>
                        }
                    </div>

                    {
                        showOTP && !showSelect ?
                            < >
                                <div className='phoneIpnut'>
                                    <SafetyCheckIcon className='safe' />
                                </div>
                                <div style={{ paddingLeft: '50px', paddingTop: '15px' }}>
                                    <label htmlFor='otp' className='lab'>
                                        {enter}
                                    </label>
                                    <OTPInput
                                        value={otp}
                                        onChange={setOtp}
                                        OTPLength={6}
                                        otpType="number"
                                        disabled={false}
                                        autoFocus
                                        className="otp_container"
                                    />
                                    {loading ?
                                        <button className='bt-disable1' disabled>
                                            <CircularProgress size={13} sx={{ color: 'white' }} />
                                        </button>
                                        :
                                        <button onClick={verifyOTP} className='bt-vr'>
                                            <span>{vo}</span>
                                        </button>
                                    }
                                </div>
                            </>
                            : !showOTP && !showSelect &&
                            < >
                                <div className='phoneIpnut1'>
                                    <PhoneIcon className='safe' />
                                </div>
                                <div style={{ paddingLeft: '100px', paddingTop: '20px' }}>
                                    <label htmlFor='ph' className='lab'>
                                        {enterp}
                                    </label>
                                    <PhoneInput
                                        country={"in"}
                                        value={ph}
                                        onChange={setPh}
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                            autoFocus: true
                                        }}
                                        className="tele_container"
                                    />
                                    {loading ?
                                        <button className='bt-disable' disabled>
                                            <CircularProgress size={13} sx={{ color: 'white' }} />
                                        </button>
                                        :
                                        <button onClick={sendOTP} className='bt-vr1'>
                                            <span>{sendo}</span>
                                        </button>
                                    }
                                    <div id='recaptcha-container' style={{ marginTop: '10px' }}></div>
                                </div>
                            </>
                    }

                    {showSelect &&
                        <div>
                            <form className='fill-content'>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{currentLangCode}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={lang}
                                        label="Age"
                                        onChange={handleLangChange}
                                    >
                                        {languages.map((lng) => {
                                            return (
                                                <MenuItem key={lng.code} value={lng.code}>{lng.lang}</MenuItem>
                                            );
                                        })}

                                    </Select>
                                </FormControl>
                            </form>
                        </div>
                    }
                    <h4 style={{ marginLeft: '83px', marginTop: '180px' }}>{morelng}</h4>
                </Box>
            </Modal>
        </div>
    )
}

export default Sidebar