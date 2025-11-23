import React from 'react'
import Header from '../section/Header'
import Footer from '../section/Footer'

const PhotoAlbum = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Photo Album</h1>
        <p>Church photos and events will be displayed here.</p>
      </main>
      <Footer />
    </>
  )
}

export default PhotoAlbum
