import React from 'react'
import Header from '../section/Header'
import Footer from '../section/Footer'
import ChurchTime from '../section/ChurchTime'

const MassTime = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <ChurchTime showOnly="mass" />
      </main>
      <Footer />
    </>
  )
}

export default MassTime
