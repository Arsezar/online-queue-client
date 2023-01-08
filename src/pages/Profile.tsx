import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/context'

const Profile = () => {
  const {setCurrent} = useContext(AuthContext);

  useEffect(() => {
    setCurrent('profile')
  }, [])

  return (
    <div>Profile</div>
  )
}

export default Profile