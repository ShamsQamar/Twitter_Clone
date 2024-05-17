import React from 'react'
import './SidebarOptions.css';

const SidebarOptions = ({ active, text, Icon, alert }) => {

  return (
    <div className={`sidebarOptions ${active && "sidebarOptions--active"}` }>
      <Icon className={`${alert && 'round'}`} />
      <h2>{text}</h2>
    </div>
  )
}

export default SidebarOptions