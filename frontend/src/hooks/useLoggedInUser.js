import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase_init'
import axios from 'axios';

const useLoggedInUser = () => {

    const [user] = useAuthState(auth);
    const email = user.email;
    const phone = user.phoneNumber && user.phoneNumber.replace('+', '');
    const [loggedInUser, setLoggedInUser] = useState({});

    const getUser = async () => {
        try {
            if (user.providerData[0].providerId === 'phone') {
                const res = await axios.get(`http://localhost:5000/phoneUser?phone=${phone}`);
                // console.log(res)
                setLoggedInUser(res.data);
            } else {
                const res = await axios.get(`http://localhost:5000/loggedInUser?email=${email}`)
                // console.log(res)
                setLoggedInUser(res.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser();
    }, [loggedInUser])

    return [loggedInUser, setLoggedInUser];
}

export default useLoggedInUser