import React from 'react'
import Header from '../section/Header'
import Footer from '../section/Footer'
import ChurchTime from '../section/ChurchTime'

const AdorationTime = () => {
  return (
    <>
      
      <main style={{ padding: '20px' }}>
        <ChurchTime showOnly="adoration" />
      </main>
      
    </>
  )
}

export default AdorationTime
