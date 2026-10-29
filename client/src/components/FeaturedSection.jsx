import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

/**
 * Component: FeaturedSection ("Now Showing")
 * Displays current Indian theatrical releases immediately underneath the hero banner.
 * - Id "now-showing" enables smooth anchor scrolling from the hero "Explore Movies" button.
 * - Displays 8 movie cards across Hindi, Telugu, Tamil, and Malayalam cinema.
 */
const FeaturedSection = () => {
    const navigate = useNavigate()
    const { shows } = useAppContext()

  return (
    <div id='now-showing' className='px-6 md:px-16 lg:px-24 xl:px-44 pt-10 pb-14'>

      {/* Section Header */}
      <div className='relative flex items-center justify-between pb-8'>
        <BlurCircle top='-20px' right='-80px'/>
        <div>
          <h2 className='text-white font-semibold text-2xl md:text-3xl tracking-tight'>Now Showing</h2>
          <p className='text-gray-400 text-sm mt-1'>Current Bollywood & regional Indian theatrical releases</p>
        </div>
        <button onClick={()=> navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 hover:text-primary cursor-pointer transition'>
            View All 
            <ArrowRight className='group-hover:translate-x-1 transition w-4 h-4'/>
        </button>
      </div>

      {/* Grid of Indian Movie Cards */}
      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-2'>
        {shows.slice(0, 8).map((show)=>(
            <MovieCard key={show._id || show.id} movie={show}/>
        ))}
      </div>

      {/* Show more button if additional movies exist */}
      {shows.length > 8 && (
        <div className='flex justify-center mt-14'>
          <button
            onClick={()=> {navigate('/movies'); scrollTo(0,0)}}
            className='px-8 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer shadow-lg shadow-primary/25 active:scale-95'
          >
            Show more movies
          </button>
        </div>
      )}
    </div>
  )
}

export default FeaturedSection
