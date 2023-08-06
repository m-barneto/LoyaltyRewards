

import React from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

export default function Homepage() {
  return (
    <MainLayout>
      <h1>AAAAAAAAAAAAAAAAA</h1>
      <p>aisdjaosidjiaoidfjaoisjdaoidaosi ddjaois djoaisjd oaijsd oaij doai jdsoiajd s</p>
      <p>aisdjaosidjiaoidfjaoisjdaoidaosi ddjaois djoaisjd oaijsd oaij doai jdsoiajd s</p>
      <Link to='/search' className='btn btn-primary'>Click to Search</Link>
    </MainLayout>
  )
}
