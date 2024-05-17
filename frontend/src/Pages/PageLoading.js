import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PageLoading = () => {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', marginLeft: '50%', minHeight: '100vh'}}>
        <CircularProgress  style={{ color: '#50b7f5' }} />
      </Box>
    )
}

export default PageLoading
