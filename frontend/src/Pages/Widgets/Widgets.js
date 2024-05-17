import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";
import './Widgets.css';
import { useTranslation } from 'react-i18next';

const Widgets = () => {

const {t} = useTranslation();
const happening = t("happening");
const search = t("search");

  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder={search} type="text" />
      </div>

      <div className="widgets__widgetContainer">
        <h2>{happening}</h2>

        <TwitterTweetEmbed tweetId={"1557187138352861186"} />

        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="elonmusk"
          options={{ height: 400 }}
        />


      </div>
    </div>
  )
}

export default Widgets