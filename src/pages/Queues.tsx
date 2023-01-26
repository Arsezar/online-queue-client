import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/context'

const Queues = () => {
  const { axiosAPI, setCurrent } = useContext(AuthContext);

	useEffect(() => {
		setCurrent('queues');
	}, [])
	

  return (
    <div>Queues</div>
  )
}

export default Queues