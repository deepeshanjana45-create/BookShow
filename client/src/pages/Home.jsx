import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'

const Home = () => {
  return (
    <div className='min-h-screen bg-[#09090B] text-white'>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
    </div>
  )
}

export default Home
