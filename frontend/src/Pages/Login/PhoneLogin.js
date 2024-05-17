import React, { useState } from 'react'
import TwitterIcon from '@mui/icons-material/Twitter';
import TwitterImage from '../../assets/image/twitter.jpeg';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import PhoneIcon from '@mui/icons-material/Phone';
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster } from 'react-hot-toast';
import OTPInput from "otp-input-react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './Login.css'
import auth from '../../firebase_init';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhoneLogin = () => {

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [ph, setPh] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const onCaptchVerify = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                setLoading(false)
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                window.recaptchaVerifier.render();
            }
        });
    }

    const sendOTP = async () => {
        if (!ph || '') return toast.error("Please enter the phone number first");
        setLoading(true);
        onCaptchVerify();

        const appVerifier = window.recaptchaVerifier;

        const formatPh = '+' + ph;
        signInWithPhoneNumber(auth, formatPh, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                console.log(confirmationResult)
                setShowOTP(true);
                setLoading(false);
                toast.success("OTP sent successfully");
            }).catch((error) => {
                // Error; SMS not sent
                console.log(error)
                appVerifier.render();
                toast.error(error.message);
                setLoading(false)
                navigate('/phone');
            });
        appVerifier.render();
    }

    const checkExist = async () => {
        const res = await axios.get(`http://localhost:5000/phoneUser?phone=${ph}`);
        const userData = res.data;
        if (!userData) setNewUser(true);
        else navigate('/feed');
    }

    const verifyOTP = () => {
        setLoading(true);
        window.confirmationResult.confirm(otp)
            .then(res => {
                console.log(res);
                setUser(res.user);
                checkExist();
                setLoading(false);
            }).catch(error => {
                console.log(error)
                setOtp('')
                toast.error(error.message);
                setLoading(false);
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const num = user.phoneNumber.replace('+', '');
        const newUser = {
            name: name,
            username: username,
            email: email,
            phoneNumber: num
        }
        console.log('newUser', newUser)
        const { data } = await axios.post("http://localhost:5000/register", newUser);
        console.log(data);
        navigate('/feed');
    }

    return (
        <div className='login-container'>
            <Toaster toastOptions={{ duration: 4000 }} />
            <div className='image-container'>
                <img className='image' src={TwitterImage} alt='twitterImage' />
            </div>
            {newUser ?
                (
                    <div className='form-container'>
                        <div className='form-box'>
                            <TwitterIcon className='Twittericon' style={{ color: 'skyblue' }} />
                            <h3 className='heading1'>Profile Details</h3>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type='text'
                                    placeholder='Enter Full Name'
                                    className='display-name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type='text'
                                    placeholder='@username'
                                    className='display-name'
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type='email'
                                    placeholder='Email'
                                    className='email'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className='btn-login'>
                                    <button type='submit' className='btn'>Sign Up</button>
                                </div>
                            </form>
                        </div>

                    </div>
                )
                :
                (
                    <div className='form-container'>
                        <div className='form-box'>
                            <TwitterIcon className='Twittericon' style={{ color: 'skyblue' }} />

                            {
                                showOTP ?
                                    < >
                                        <div className='phoneIpnut'>
                                            <SafetyCheckIcon className='safe' />
                                        </div>
                                        <label htmlFor='otp' className='lab'>
                                            Enter your OTP
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
                                                <span>Verify OTP</span>
                                            </button>
                                        }
                                    </>
                                    :
                                    < >
                                        <div className='phoneIpnut1'>
                                            <PhoneIcon className='safe' />
                                        </div>
                                        <label htmlFor='ph' className='lab'>
                                            Enter your phone number
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
                                                <span>Send OTP</span>
                                            </button>
                                        }
                                        <div id='recaptcha-container' style={{ marginTop: '10px' }}></div>
                                    </>
                            }

                        </div>

                    </div>
                )
            }
        </div>
    )
}

export default PhoneLogin