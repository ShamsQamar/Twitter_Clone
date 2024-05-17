import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home';
import { Login } from './Pages/Login/Login';
import { Signup } from './Pages/Login/Signup';
import ProtectedRoute from './Pages/ProtectedRoute';
import PageLoading from './Pages/PageLoading';
import Feed from './Pages/Feed/Feed';
import Explore from './Pages/Explore/Explore';
import Notifications from './Pages/Notifications/Notifications';
import Messages from './Pages/Messages/Messages';
import Bookmarks from './Pages/Bookmarks/Bookmarks';
import Lists from './Pages/Lists/Lists';
import Profile from './Pages/Profile/Profile';
import More from './Pages/More/More';
import PhoneLogin from './Pages/Login/PhoneLogin';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase_init';
import OthersProfile from './Pages/Profile/MainProfile/OthersProfile';

function App() {
  
  const [tokens, setTokens] = useState([]);
  const [loggedInUserToken, setLoggedInUserToken] = useState('');
  const [alert, setAlert] = useState(false);
  const [otherUser, setOtherUser] = useState({});
  const [myName, setMyName] = useState('');

  const registerNames = ["Shams Qamar","Sarah John","Bhola Kumar","Tabish Qamar"];

  const getTokens = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tokens');
      // console.log('tokens',res.data);
      setTokens(res.data);
    } catch (error) {
      console.log(error)
    }
    requestPermission();
  }

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: "BJClitIqy9po35WmQx_oelZ1dOpKDlwnwKu7NsPu-siYsZPcWmW30iPIlzdjbnz8KXrGGUO1uXdp6OgMGGA3UdY"
      })
      // console.log('token gen', token);
      setLoggedInUserToken(token);
      const generatedToken = {
        token: token
      }
      try {
        const res = await axios.patch(`http://localhost:5000/addToken`, generatedToken);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }

    } else if (permission === 'denied') console.log('You denied for the notification');
  }

  useEffect(() => {
    getTokens();
  }, [])

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home alert={alert} setAlert={setAlert} registerNames={registerNames} setMyName={setMyName} myName={myName}/> </ProtectedRoute>} >
            <Route index element={<Feed setOtherUser={setOtherUser} tokens={tokens} loggedInUserToken={loggedInUserToken} registerNames={registerNames} />} />
          </Route>
          <Route path='/' element={<ProtectedRoute><Home alert={alert} setAlert={setAlert} registerNames={registerNames} setMyName={setMyName} myName={myName}/> </ProtectedRoute>} >
            <Route path='feed' element={<Feed setOtherUser={setOtherUser} tokens={tokens} loggedInUserToken={loggedInUserToken} registerNames={registerNames} />} />
            <Route path='explore' element={<Explore />} />
            <Route path='notifications' element={<Notifications setAlert={setAlert} registerNames={registerNames}/>} />
            <Route path='messages' element={<Messages />} />
            <Route path='bookmarks' element={<Bookmarks />} />
            <Route path='lists' element={<Lists />} />
            <Route path='profile' element={<Profile tokens={tokens} loggedInUserToken={loggedInUserToken} myName={myName} registerNames={registerNames} />} />
            <Route path='otherProfile' element={<OthersProfile otherUser={otherUser} tokens={tokens} loggedInUserToken={loggedInUserToken} registerNames={registerNames}/>} />
            <Route path='more' element={<More />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/phone' element={<PhoneLogin />} />
          <Route path='/page-loading' element={<PageLoading />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
