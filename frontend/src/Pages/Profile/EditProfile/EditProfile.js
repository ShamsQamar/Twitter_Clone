import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material'
import TextField from '@mui/material/TextField';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close'
import './EditProfile.css'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 540,
  height: 540,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 8,
};


function EditChild({ dob, setDob, t }) {
  const [open, setOpen] = useState(false);
  const {edob, desc, close, e} = t("profile")

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <div className='birthdate-section' onClick={handleOpen}>
        <span>{e}</span>
      </div>

      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 330, height: 350 }}>
          <div className='text'>
            <h2>{edob}</h2>
            <p>{desc} </p>
            {/* <Button className='e-button'>Edit</Button> */}
            <input
              type="date"
              onChange={e => setDob(e.target.value)}
            />
            <Button style={{ backgroundColor: 'black' }} className='e-button' onClick={() => { setOpen(false) }}>{close}</Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export default function EditProfile({ user, loggedInUser }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [dob, setDob] = useState('')

  const { t } = useTranslation();
  const { edit, editp, save, birth, switchh, adob } = t("profile");

  const handleSave = async () => {
    const editedInfo = {
      name,
      bio,
      location,
      website,
      dob
    }
    // console.log(editedInfo)
    // console.log(user.email)
    if (editedInfo) {
      try {
        await axios.patch(`http://localhost:5000/userUpdates/${loggedInUser.email}`, editedInfo);
        setOpen(false);
      } catch (error) {
        console.log("error while updating info", error)
      }
    }
  }

  return (
    <div >

      <button onClick={() => { setOpen(true) }} className="edit-profile-btn" >{edit}</button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className='modal' >
          <div className='header'>
            <IconButton onClick={() => { setOpen(false); }} ><CloseIcon /></IconButton>
            <h2 className='header-title'> {editp}</h2>
            <button className='save-btn' onClick={handleSave}>{save}</button>
          </div>
          <form className='fill-content'>
            <TextField className='text-field' fullWidth label="Name" id="fullWidth" variant='filled' onChange={(e) => setName(e.target.value)} defaultValue={loggedInUser.name ? loggedInUser.name : ''} />
            <TextField className='text-field' fullWidth label="Bio" id="fullWidth" variant='filled' onChange={(e) => setBio(e.target.value)} defaultValue={loggedInUser.bio ? loggedInUser.bio : ''} />
            <TextField className='text-field' fullWidth label="Location" id="fullWidth" variant='filled' onChange={(e) => setLocation(e.target.value)} defaultValue={loggedInUser.location ? loggedInUser.location : ''} />
            <TextField className='text-field' fullWidth label="Website" id="fullWidth" variant='filled' onChange={(e) => setWebsite(e.target.value)} defaultValue={loggedInUser.website ? loggedInUser.website : ''} />
          </form>
          <div className='birthdate-section'>
            <p>{birth}</p>
            <p>.</p>
            <EditChild dob={dob} setDob={setDob} t={t}/>
          </div>
          <div className='last-section'>
            {
              loggedInUser.dob ?
                <h2>{loggedInUser.dob}</h2> :
                <h2>
                  {
                    dob ? dob : `${adob}`
                  }
                </h2>
            }
            <div className='last-btn'>
              <h2>{switchh} </h2>
              <ChevronRightIcon />
            </div>
          </div>
        </Box>
      </Modal>

    </div>
  )
}