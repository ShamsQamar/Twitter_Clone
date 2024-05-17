import React, { useState } from 'react'
import TwitterIcon from '@mui/icons-material/Twitter';
import TwitterImage from '../../assets/image/twitter.jpeg';
import auth from '../../firebase_init';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import axios from 'axios';

export const Signup = () => {

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

    if (user || googleUser) {
        navigate('/');
        console.log(user);
        console.log(googleUser);
    }
    if (error) console.log(error.message);

    const handleSubmit = async (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(email, password);
        const newUser = {
            username: username,
            name: name,
            email: email
        }
        const { data } = await axios.post("http://localhost:5000/register", newUser);
        console.log(data);
    }

    const handleGoogleSignIn = () => {
        signInWithGoogle();
    }


    return (
        <div className='login-container'>
            <div className='image-container'>
                <img className='image' src={TwitterImage} alt='twitterImage' />
            </div>
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
                        <input
                            type='password'
                            placeholder='Password'
                            className='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='btn-login'>
                            <button type='submit' className='btn'>Sign Up</button>
                        </div>
                    </form>
                </div>
                <hr style={{ marginTop: '-18px', marginBottom: '19px' }} />
                <div className='google-button'>
                    <GoogleButton
                        className='g-btn'
                        type='light'
                        onClick={handleGoogleSignIn}
                    />
                </div>
                <div className='dont'>
                    Already have an account?
                    <Link
                        to='/login'
                        style={{
                            textDecoration: 'none',
                            color: 'skyblue',
                            fontWeight: 600,
                            marginLeft: '5px'
                        }}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
