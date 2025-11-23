import React from 'react'
import Header from '../section/Header'
import Footer from '../section/Footer'
import ChurchTime from '../section/ChurchTime'

const ConfessionTime = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <ChurchTime showOnly="confession" />
      </main>
      <Footer />
    </>
  )
}

export default ConfessionTime
