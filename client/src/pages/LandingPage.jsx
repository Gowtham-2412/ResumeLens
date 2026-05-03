import React from 'react'
import HeroSection from '../sections/HeroSection'
import HowitWorks from '../sections/HowitWorks'
import KeyFeatures from '../sections/KeyFeatures'
import Footer from '../sections/Footer'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const LandingPage = () => {

    const { user } = useAuth()

    return (
        <div className='page-shell'>
            <Navbar />
            { user&&
                <Navigate to={`/${user.id}`} />
            }
            <HeroSection/>
            <HowitWorks/>
            <KeyFeatures/>
            {/* <ExampleSection/> */}
            <Footer/>
        </div>
    )
}

export default LandingPage
