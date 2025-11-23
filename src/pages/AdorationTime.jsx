import React from 'react'
import Header from '../section/Header'
import Footer from '../section/Footer'
import ChurchTime from '../section/ChurchTime'

const AdorationTime = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <ChurchTime showOnly="adoration" />
      </main>
      <Footer />
    </>
  )
}

export default AdorationTime
