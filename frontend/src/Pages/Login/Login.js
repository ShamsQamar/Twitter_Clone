import React, { useState } from 'react'
import TwitterIcon from '@mui/icons-material/Twitter';
import TwitterImage from '../../assets/image/twitter.jpeg';
import auth from '../../firebase_init';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'

export const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

  if (user || googleUser) {
    navigate('/');
    // console.log(user);
    // console.log(googleUser);
  }
  // if (error) console.log(error.message);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password)
    } catch (error) {
      console.log(error)
    }
    if (error) window.alert('Invalid Credentials or User is not Registered');
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
          <h2 className='heading'>Happing Now</h2>
          <h3 className='heading1'>What happening today</h3>
          <form onSubmit={handleSubmit}>
            <input type='email' placeholder='Email' required
              className='email' onChange={(e) => setEmail(e.target.value)} />
            <input type='password' placeholder='Password' required
              className='password' onChange={(e) => setPassword(e.target.value)} />
            <div className='btn-login'>
              <button type='submit' className='btn'>Login</button>
            </div>
          </form>
        </div>
        <hr style={{ marginTop: '-12px' }} />
        <div style={{ marginLeft: '50px', fontSize: '15px'}} >Login/Sign Up with
          <Link
            to='/phone'
            style={{
              textDecoration: 'none',
              color: 'skyblue',
              fontWeight: 600,
              marginLeft: '5px'
            }}
          >
            Phone
          </Link>
         <div style={{ marginLeft: '60px', color: '#868687'}} >OR</div>
        </div>
        <div className='google-button'>
          <GoogleButton
            className='g-btn'
            type='light'
            onClick={handleGoogleSignIn}
          />
        </div>
        <div className='dont'>
          Don't have an account?
          <Link
            to='/signup'
            style={{
              textDecoration: 'none',
              color: 'skyblue',
              fontWeight: 600,
              marginLeft: '5px'
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
