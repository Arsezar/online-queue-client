import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/context';

const Menu = () => {
  const { setCurrent } = useContext(AuthContext);
  useEffect(() => {
    setCurrent('menu');
  }, [])

  return (
    <div>Menu</div>
  )
}

export default Menu