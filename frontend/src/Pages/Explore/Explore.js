import React from 'react'
import '../Page.css';
import { useTranslation } from 'react-i18next';

const Explore = () => {

    const { t } = useTranslation();
    const soon = t("soon");

    return (
        <div className='page'>
            <h2 className='pageTitle'>{soon}</h2>
        </div>
    )
}

export default Explore