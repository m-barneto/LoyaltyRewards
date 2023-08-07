import React from 'react'
import { useParams } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'

export default function MemberPage() {
  const { id } = useParams();
  return (
    <MainLayout>
      <div className='mt-3 p-2 bg-dark rounded'>

      </div>
    </MainLayout>
  )
}
