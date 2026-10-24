import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import './Calendar.css'


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents')
    return savedEvents ? JSON.parse(savedEvents) : {}
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventText, setEventText] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`
    setSelectedDate(dateKey)
    setEventText(events[dateKey] || '')
  }

  const handleAddEvent = () => {
    if (selectedDate && eventText.trim()) {
      setEvents({ ...events, [selectedDate]: eventText })
      setEventText('')
      setSelectedDate(null)
    }
  }

  const handleLogin = () => {
    if (password === 'ctk33') {
      setIsAdmin(true)
      setShowLogin(false)
      setPassword('')
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setSelectedDate(null)
    setEventText('')
  }

  const renderCalendar = () => {
    const days = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)
    const calendarDays = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= days; day++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`
      const eventText = events[dateKey]
      calendarDays.push(
        <div
          key={day}
          className={`calendar-day ${eventText ? 'has-event' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          {eventText && <div className="event-text">{eventText}</div>}
        </div>
      )
    }

    return calendarDays
  }

  return (
  
      <main className="calendar-main">
        <motion.div
          className="calendar-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            style={{ color: '#800000', textAlign: 'center', marginBottom: '20px', fontSize: '2.5rem' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Church Calendar
          </motion.h1>
          <motion.div
            className="admin-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {!isAdmin ? (
              <motion.button
                onClick={() => setShowLogin(true)}
                className="admin-login-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin Login
              </motion.button>
            ) : (
              <motion.div
                className="admin-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <span style={{ color: '#2d5016', marginRight: '10px' }}>Admin Mode</span>
                <motion.button
                  onClick={handleLogout}
                  className="admin-logout-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </motion.div>
            )}
          </motion.div>
          <AnimatePresence>
            {showLogin && (
              <motion.div
                className="login-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="login-form"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ color: '#2d5016', marginBottom: '15px' }}>Admin Login</h3>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #8b4513', borderRadius: '4px' }}
                  />
                  <motion.button
                    onClick={handleLogin}
                    className="login-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => { setShowLogin(false); setPassword(''); }}
                    className="cancel-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            className="calendar-header"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={handlePrevMonth}
              className="nav-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              { '<' }
            </motion.button>
            <h2 style={{ color: '#2d5016', margin: '0 20px' }}>
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h2>
            <motion.button
              onClick={handleNextMonth}
              className="nav-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              { '>' }
            </motion.button>
          </motion.div>
          <motion.div
            className="calendar-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="calendar-day header">Sun</div>
            <div className="calendar-day header">Mon</div>
            <div className="calendar-day header">Tue</div>
            <div className="calendar-day header">Wed</div>
            <div className="calendar-day header">Thu</div>
            <div className="calendar-day header">Fri</div>
            <div className="calendar-day header">Sat</div>
            {renderCalendar()}
          </motion.div>
          <AnimatePresence>
            {selectedDate && isAdmin && (
              <motion.div
                className="event-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 style={{ color: '#2d5016' }}>Add Event for {selectedDate.split('-')[2]}</h3>
                <textarea
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  placeholder="Enter event details..."
                  rows="4"
                  style={{ width: '100%', marginBottom: '10px', padding: '10px', border: '1px solid #8b4513', borderRadius: '4px' }}
                />
                <motion.button
                  onClick={handleAddEvent}
                  className="add-event-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Event
                </motion.button>
                <motion.button
                  onClick={() => setSelectedDate(null)}
                  className="cancel-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

  )
}

export default Calendar
