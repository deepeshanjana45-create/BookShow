import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'

// Language map for Indian cinema labels
const languageMap = {
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  ml: 'Malayalam',
  kn: 'Kannada',
  en: 'English'
}

/**
 * Component: MovieCard
 * Displays individual Indian movie poster, language badge, runtime, rating, and booking button.
 */
const MovieCard = ({movie}) => {
    const navigate = useNavigate()

    const movieId = movie?._id || movie?.id;

    // Build TMDB w500 poster image URL
    const rawPath = movie.poster_path || movie.backdrop_path
    const posterUrl = rawPath?.startsWith('http')
      ? rawPath
      : (rawPath ? `https://image.tmdb.org/t/p/w500${rawPath.startsWith('/') ? '' : '/'}${rawPath}` : '/profile.png')

    const langName = languageMap[movie.original_language?.toLowerCase()] || movie.original_language?.toUpperCase() || 'Indian'

    const releaseFormatted = movie.release_date
      ? new Date(movie.release_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "Coming Soon"

    const isBookable = movie.hasConfiguredShows !== false

    const handleMovieClick = () => {
      if (movieId) {
        navigate(`/movies/${movieId}`)
        scrollTo(0, 0)
      }
    }

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66 shadow-md'>

      {/* Poster Image with Language Badge */}
      <div className='relative overflow-hidden rounded-lg bg-gray-900'>
        <img
          onClick={handleMovieClick}
          src={posterUrl}
          alt={movie.title}
          onError={(e) => {
            const raw = movie.poster_path || movie.backdrop_path
            if (raw && !e.currentTarget.src.includes('weserv.nl')) {
              e.currentTarget.src = `https://images.weserv.nl/?url=image.tmdb.org/t/p/w500${raw.startsWith('/') ? '' : '/'}${raw}`
            }
          }}
          className='rounded-lg h-52 w-full object-cover object-center cursor-pointer hover:scale-105 transition duration-300'
        />
        <span className='absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full border border-primary/40'>
          {langName}
        </span>
      </div>

       {/* Title */}
       <p className='font-semibold mt-2.5 truncate text-white cursor-pointer' onClick={handleMovieClick} title={movie.title}>
         {movie.title}
       </p>

       {/* Genres & Runtime */}
       <div className='text-xs text-gray-400 mt-1 flex flex-col gap-0.5'>
        <p className='truncate'>
          {movie.genres?.slice(0, 2).map(genre => genre.name).join(" • ")} {movie.runtime ? `• ${timeFormat(movie.runtime)}` : ''}
        </p>
        <p className='text-[11px] text-gray-500'>
          Released: {releaseFormatted}
        </p>
       </div>

       {/* Booking Button & Rating */}
       <div className='flex items-center justify-between mt-4 pb-2'>
        <button
          onClick={handleMovieClick}
          className={`px-4 py-2 text-xs transition rounded-full font-medium cursor-pointer ${
            isBookable
              ? 'bg-primary hover:bg-primary-dull text-white shadow-sm shadow-primary/20'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          {isBookable ? 'Buy Tickets' : 'View Details'}
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-300 font-medium pr-1'>
            <StarIcon className="w-4 h-4 text-primary fill-primary"/>
            {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '8.0'}
        </p>
       </div>

    </div>
  )
}

export default MovieCard
