import React, { useEffect, useState } from 'react'
import './Feed.css';
import TweetBox from './TweetBox/TweetBox';
import axios from 'axios';
import Post from './Post/Post';
import { useTranslation } from 'react-i18next';

const Feed = ({ setOtherUser, tokens, loggedInUserToken, registerNames }) => {

  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();
  const { home } = t("sidebar");

  const getAllPosts = async () => {
    let res = await axios.get('http://localhost:5000/post');
    setPosts(res.data);
  }

  useEffect(() => {
    getAllPosts();
  }, [posts])

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>{home}</h2>
      </div>
      <TweetBox tokens={tokens} loggedInUserToken={loggedInUserToken} />
      {
        posts.map( post => <Post key={post._id} p={post} tokens={tokens} loggedInUserToken={loggedInUserToken} posts={posts} setOtherUser={setOtherUser} registerNames={registerNames} />)
      }
    </div>
  )
}

export default Feed;