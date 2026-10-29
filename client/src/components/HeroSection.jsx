import React from 'react'
import { ArrowRight, TicketIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Component: HeroSection
 * 
 * Features:
 * - Background: Indian movie poster collage (/background.png).
 * - Multi-layer dark gradient overlay: Ensures crystal-clear text readability while preserving cinematic poster visibility.
 * - Headline: "Book your tickets. Experience cinema like never before."
 * - Prominent pink CTA button: "Book Your Show Now" navigating directly to the movie booking/showtimes catalog (/movies).
 * - Compact responsive height: Keeps "Now Showing" movie cards visible without excessive scrolling.
 */
const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <div
      className='relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 min-h-[55vh] md:h-[62vh] pt-24 pb-8 bg-cover bg-center transition-all duration-500'
      style={{
        // Dark gradient overlay for maximum contrast and readable typography
        backgroundImage: `
          linear-gradient(to right, rgba(9, 9, 11, 0.96) 20%, rgba(9, 9, 11, 0.78) 55%, rgba(9, 9, 11, 0.92) 100%),
          linear-gradient(to top, rgba(9, 9, 11, 1) 0%, rgba(9, 9, 11, 0.35) 60%),
          url('/background.png')
        `,
      }}
    >
      {/* Hero Headline */}
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold max-w-3xl text-white drop-shadow-md leading-tight tracking-tight'>
        Book your tickets. <br />
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300'>
          Experience cinema like never before.
        </span>
      </h1>

      {/* Subtitle Description */}
      <p className='max-w-xl text-gray-300 text-sm md:text-base leading-relaxed'>
        Catch the latest Bollywood, Tollywood, Kollywood, and regional Indian blockbusters with instant seat selection and secure booking.
      </p>

      {/* Action Buttons */}
      <div className='flex items-center flex-wrap gap-4 mt-2'>
        {/* Prominent Pink "Book Your Show Now" Button */}
        <button
          onClick={() => navigate('/movies')}
          className='flex items-center gap-2 px-8 py-3.5 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-semibold cursor-pointer active:scale-95 shadow-lg shadow-primary/35 text-white'
        >
          <TicketIcon className="w-4 h-4" />
          Book Your Show Now
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Anchor link to browse "Now Showing" section right below */}
        <a
          href="#now-showing"
          className='flex items-center gap-2 px-6 py-3.5 text-sm bg-gray-800/80 hover:bg-gray-800 border border-gray-700 transition rounded-full font-medium cursor-pointer text-gray-200 active:scale-95'
        >
          View Now Showing
        </a>
      </div>
    </div>
  )
}

export default HeroSection
