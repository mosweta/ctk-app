import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './MinistrySignup.css'
import headerBg from '../assets/bg1.jpeg'

const SectionForm = ({ id, title }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Submitted for ${title}: ${JSON.stringify(form)}`)
    setForm({ name: '', email: '', phone: '' })
  }

  return (
    <motion.section 
      className="signup-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3 
        className="card-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {title}
      </motion.h3>
      <motion.form 
        onSubmit={handleSubmit} 
        id={id} 
        className="signup-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Full name" 
          required 
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          placeholder="Email" 
          type="email" 
          required 
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          placeholder="Phone"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.div className="form-actions">
          <motion.button 
            type="submit" 
            className="btn-submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.section>
  )
}

const MinistrySignup = () => {
  return (
    <motion.main 
      className="ministry-signup-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="signup-header" 
        style={{ backgroundImage: `url(${headerBg})` }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="header-overlay" />
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1>Sign Up</h1>
          <p>Please choose a ministry below and fill the sign up form.</p>
        </motion.div>
      </motion.header>

      <motion.section 
        className="signup-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {[
          { id: "cma", title: "CMA (Catholic Men Association)" },
          { id: "cwa", title: "CWA (Catholic Women Association)" },
          { id: "ycs", title: "YCS (Youth Catholic Society)" },
          { id: "pmc", title: "PMC (Parish Missionary Community)" }
        ].map((form, index) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
          >
            <SectionForm id={form.id} title={form.title} />
          </motion.div>
        ))}
      </motion.section>
    </motion.main>
  )
}

export default MinistrySignup
