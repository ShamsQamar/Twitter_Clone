import React from 'react'
import '../Page.css';
import MainProfile from './MainProfile/MainProfile';
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../../firebase_init'

const Profile = ({ tokens, loggedInUserToken, myName, registerNames }) => {

  const [user] = useAuthState(auth) 

  return (
    <div className='profilePage'>
      <MainProfile user={user} tokens={tokens} loggedInUserToken={loggedInUserToken} myName={myName} registerNames={registerNames} />
    </div>
  )
}

export default Profile