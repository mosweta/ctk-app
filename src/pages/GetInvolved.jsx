import React from 'react'
import { motion } from 'framer-motion'
import Header from '../section/Header'
import Footer from '../section/Footer'
import './GetInvolved.css'

const GetInvolved = () => {
  const jumuiyaList = [
    'Our Lady of Holy Rosary',
    'St. Charles Lwanga',
    'St. Mark',
    'St. Gabriel',
    'St. Leo the Great',
    'St. Joan of Arc',
    'Our Lady of Assumption',
    'St. Lawrence of Rome',
    'Our Lady Queen of Peace',
    'Our Lady Help of Christians',
    'St. Martin de Porres',
    'St. Michael the Archangel',
    'St. Martina of Rome',
    'Holy Family',
    'St. Peter and Paul',
    'St. Joseph the Worker',
    'St. Ignatius of Loyola',
    'Our Lady of Mt. Carmel',
    'St. Lucia',
    'St. Claire of Assisi',
    'St. Josemaria Escriva',
    'St. Patrick',
    'St. Faustina Kowalska',
    'St. Teresa of Calcutta',
    'St. Teresa of Avila',
    'St. Maximillian Kolbe',
    'St. Benedict',
    'St. Monica',
    'St. Anthony of Padua',
    'st stephen',
    'St Jude',
    'St. Teresa of the Child Jesus',
    'St. Clement of Rome',
    'St. Perpetua',
    'All Saints',
    'Our Lady of Fatima',
    'St. Francis of assisi',
    'St. Maria Goretti', 
    'St. Bakhita',
    'St Vincent de Paul',
    'St. Bernard',
    'St. Thomas of Aquinas',
    'St. Austin',
    'St.Andrew Kaggwa',
    'St. Mary Magdalene',
    'St. Philomena',
    'St. Agatha',
    'St.Giovanni Antonio Farina',
    'St. Catherine of Siena',
    'St. Ignatius of Antioch',
    'Our Lady of Mercy',
    'St. Rita of Cascia',
    'St. Peter Claver',
    'our lady of lourdes',
    'St. Christopher (Airport)',
    'St. Nicholas of Antioch'
  ]

  const ecclesialGroups = [
    'PMC',
    'MYM',
    'Youth',
    'YCA',
    'CMA',
    'CWA',
    'Couples for Christ',
    'Charismatic',
    'Divine Mercy',
    'Sacred Heart',
    'Christ the King Self Help Group',
    'SDP-Social Development Program',
    'CJPD-Catholic Justice and Peace Department'
  ]

  const choirList = [
    'St. Cecilia Choir',
    'St. Gregory the Great Choir',
    'St. Dominic Savio',
    'St. Kizito',
    'YSC choir',
    'St. Augustine'
  ]

  return (
   
      <main className="get-involved-main">
        <div className="get-involved-header">
          <motion.h1
            style={{
              color: '#86b18bff',
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              letterSpacing: '2px',
              position: 'relative',
              zIndex: 1
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            Get Involved
          </motion.h1>
        </div>
        <div className="get-involved-content">
          <motion.section
            className="jumuiya-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>List of Jumuiya </h2>
            <ul className="jumuiya-list">
              {jumuiyaList.map((jumuiya, index) => (
                <li key={index}>{index + 1}. {jumuiya}</li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="groups-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Groups and Choirs</h2>
            <div className="groups-content">
              <h3>Groups</h3>
              <h4>Ecclesial Groups</h4>
              <ol className="jumuiya-list">
                {ecclesialGroups.map((group, index) => (
                  <li key={index}>{index + 1}. {group}</li>
                ))}
              </ol>
              <h3>Choirs</h3>
              <ol className="jumuiya-list">
                {choirList.map((choir, index) => (
                  <li key={index}>{index + 1}. {choir}</li>
                ))}
              </ol>
            </div>
          </motion.section>
        </div>
      </main>

  )
}

export default GetInvolved
