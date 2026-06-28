import React from 'react'
import HeroSection from '../sections/HeroSection'
import StatsBar from '../sections/StatsBar'
import HowitWorks from '../sections/HowitWorks'
import KeyFeatures from '../sections/KeyFeatures'
import BeforeAfter from '../sections/BeforeAfter'
import Testimonials from '../sections/Testimonials'
import FAQ from '../sections/FAQ'
import Footer from '../sections/Footer'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const LandingPage = () => {
  const { user } = useAuth()

  return (
    <div className='page-shell'>
      <Navbar />
      {user && <Navigate to={`/${user.id}`} />}
      <HeroSection />
      <StatsBar />
      <HowitWorks />
      <KeyFeatures />
      <BeforeAfter />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}

export default LandingPage
