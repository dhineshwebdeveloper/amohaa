'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './style.module.css'
import one from '@/public/img/contact.png'
import Image from 'next/image'
import bgimage from '@/public/img/contactusbg.jpg'
import { url } from 'inspector'

export default function ContactForm () {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    number: '',
    subject: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    number: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error message on input change
    setErrors({ ...errors, [name]: '' })
  }

  const validate = () => {
    let valid = true
    const newErrors = {
      name: '',
      email: '',
      number: '',
      subject: '',
      message: ''
    }

    // Full Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.'
      valid = false
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters.'
      valid = false
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.'
      valid = false
    }

    // Phone Number Validation
    if (!formData.number.trim()) {
      newErrors.number = 'Phone number is required.'
      valid = false
    } else if (!/^\d{10}$/.test(formData.number)) {
      newErrors.number = 'Phone number must be 10 digits.'
      valid = false
    }

    // Subject Validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.'
      valid = false
    }

    // Message Validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.'
      valid = false
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('Sending...')
    setShowModal(true)

    try {
      // Send data to the contact form API route
      const dbResponse = await axios.post('/api/contactform', formData)
      if (dbResponse.status === 201) {
        setStatus('Sending...')

        // Now, send the email
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json()
          throw new Error(errorData.message || 'Failed to send message.')
        }

        setStatus('Message send successfully!')
        setFormData({
          name: '',
          email: '',
          message: '',
          number: '',
          subject: ''
        })
      }
    } catch (error: any) {
      setStatus(
        `Error: ${error.message || 'An error occurred. Please try again.'}`
      )
    }
  }

  // Automatically hide the status modal after 5 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false)
      }, 12000) // Hide after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [showModal])

  return (
    <section
      className='contact-section fix p-5'
      style={{
        backgroundImage: `url(${bgimage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className='text-center pb-5'>
        <h1 style={{ color: 'white' }}>Contact us</h1>
      </div>
      <div className='container'>
        <div className='contact-wrapper'>
          <div className='row g-4'>
            <div className='col-lg-6'>
              <div className='contact-left'>
                <h2
                  data-aos='fade-up'
                  data-aos-duration='800'
                  data-aos-delay='300'
                ></h2>
                <div
                  className='contact-image'
                  data-aos='fade-up'
                  data-aos-duration='800'
                  data-aos-delay='500'
                >
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089943376!2d77.46612593299315!3d12.953945614011563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1735573783802!5m2!1sen!2sin'
                    width='100%'
                    height='550px'
                    style={{ border: 0 }}
                    allowFullScreen
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    title='Google Map'
                  ></iframe>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='contact-right'>
                <h3
                  data-aos='fade-up'
                  className='text-center'
                  data-aos-duration='800'
                  style={{ color: 'white' }}
                >
                  Your vision, our expertise. Get in touch to make it happen.
                </h3>
                <form onSubmit={handleSubmit} className='contact-form-items'>
                  <div className='row g-4'>
                    {/* Name Field */}
                    <div
                      className='col-lg-6'
                      data-aos='fade-up'
                      data-aos-duration='800'
                      data-aos-delay='300'
                    >
                      <div className='form-clt'>
                        <input
                          value={formData.name}
                          onChange={handleChange}
                          type='text'
                          name='name'
                          placeholder='Full Name'
                          className={`${
                            errors.name
                              ? styles.error
                              : formData.name && !errors.name
                              ? styles.success
                              : ''
                          }`}
                        />
                        {errors.name && (
                          <p className={styles.errorText}>{errors.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div
                      className='col-lg-6'
                      data-aos='fade-up'
                      data-aos-duration='800'
                      data-aos-delay='500'
                    >
                      <div className='form-clt'>
                        <input
                          value={formData.email}
                          onChange={handleChange}
                          type='email'
                          name='email'
                          placeholder='Email Address'
                          className={`${
                            errors.email
                              ? styles.error
                              : formData.email && !errors.email
                              ? styles.success
                              : ''
                          }`}
                        />
                        {errors.email && (
                          <p className={styles.errorText}>{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone Number Field */}
                    <div
                      className='col-lg-6'
                      data-aos='fade-up'
                      data-aos-duration='800'
                      data-aos-delay='500'
                    >
                      <div className='form-clt'>
                        <input
                          value={formData.number}
                          onChange={handleChange}
                          type='number'
                          name='number'
                          placeholder='Phone Number'
                          className={`${
                            errors.number
                              ? styles.error
                              : formData.number && !errors.number
                              ? styles.success
                              : ''
                          }`}
                        />
                        {errors.number && (
                          <p className={styles.errorText}>{errors.number}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div
                      className='col-lg-6'
                      data-aos='fade-up'
                      data-aos-duration='800'
                      data-aos-delay='500'
                    >
                      <div className='form-clt'>
                        <select
                          name='subject'
                          value={formData.subject}
                          onChange={handleChange}
                          className={`${
                            errors.subject
                              ? styles.error
                              : formData.subject && !errors.subject
                              ? styles.success
                              : ''
                          }`}
                        >
                          <option value=''>Select Subject</option>
                          <option value='Domain'>Hosting</option>
                          <option value='Hosting'>Website</option>
                          <option value='VPS Hosting'>SMS Gateway</option>
                          <option value='VPS Hosting'>WhatsApp Gateway</option>
                          <option value='Others'>Others</option>
                        </select>
                        {errors.subject && (
                          <p className={styles.errorText}>{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    {/* Message Field */}
                    <div
                      className='col-lg-12'
                      data-aos='fade-up'
                      data-aos-duration='800'
                      data-aos-delay='700'
                    >
                      <div className='form-clt'>
                        <textarea
                          value={formData.message}
                          onChange={handleChange}
                          name='message'
                          placeholder='Message'
                          className={`${
                            errors.message
                              ? styles.error
                              : formData.message && !errors.message
                              ? styles.success
                              : ''
                          }`}
                        ></textarea>
                        {errors.message && (
                          <p className={styles.errorText}>{errors.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div
                      className='col-lg-12'
                      data-aos='fade-up'
                      data-aos-duration='800'
                      data-aos-delay='900'
                    >
                      <button type='submit' className='theme-btn'>
                        Submit Now{' '}
                        <i className='fa-solid fa-arrow-right-long'></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal with timer line */}
      {showModal && (
        <div className={styles['status-modal']}>
          <p>{status}</p>
          <div className={styles['timer-line']}></div>
        </div>
      )}
    </section>
  )
}
