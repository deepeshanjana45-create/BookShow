import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData, configuredShowMovieIds } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon, AlertCircle } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useClerk } from '@clerk/clerk-react'

const languageMap = {
  hi: 'HINDI (BOLLYWOOD)',
  te: 'TELUGU',
  ta: 'TAMIL',
  ml: 'MALAYALAM',
  kn: 'KANNADA',
  en: 'INDIAN RELEASE'
}

const tmdbImg = (path, size = 'w500') => {
  if (!path) return '/profile.png'
  if (path.startsWith('http')) return path
  return `https://image.tmdb.org/t/p/${size}${path.startsWith('/') ? '' : '/'}${path}`
}

const tmdbImgFallback = (path, size = 'w500') => {
  if (!path) return '/profile.png'
  return `https://images.weserv.nl/?url=image.tmdb.org/t/p/${size}${path.startsWith('/') ? '' : '/'}${path}`
}

const MovieDetails = () => {

  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)
  const { openSignIn } = useClerk()

  const {shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies} = useAppContext()

  const getShow = async ()=>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if(data.success && data.movie){
        setShow(data)
        return
      }
    } catch (error) {
      console.log(error)
    }

    const foundMovie = (shows || dummyShowsData).find(m => String(m._id) === String(id) || String(m.id) === String(id))
    if(foundMovie){
      const hasConfigured = configuredShowMovieIds.includes(String(foundMovie._id)) || foundMovie.hasConfiguredShows === true
      setShow({
        movie: foundMovie,
        dateTime: hasConfigured ? dummyDateTimeData : {}
      })
    }
  }

  const handleFavorite = async ()=>{
    try {
      if(!user) {
        toast.error("Please login to proceed")
        openSignIn()
        return
      }

      const { data } = await axios.post('/api/user/update-favorite', {movieId: id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    setShow(null);
    getShow();
  },[id])

  if (!show || !show.movie) return <Loading />

  const langKey = show.movie.original_language?.toLowerCase()
  const displayLanguage = languageMap[langKey] || show.movie.original_language?.toUpperCase() || 'INDIAN CINEMA'
  const hasUpcomingShows = show.dateTime && Object.keys(show.dateTime).length > 0

  const rawPoster = show.movie.poster_path || show.movie.backdrop_path

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>

        <img
          src={tmdbImg(rawPoster)}
          alt={show.movie.title}
          onError={(e) => { e.currentTarget.src = tmdbImgFallback(rawPoster); }}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover shadow-2xl bg-gray-900'
        />

        <div className='relative flex flex-col gap-3'>
          <BlurCircle top="-100px" left="-100px"/>
          <p className='text-primary font-semibold tracking-wider text-sm'>{displayLanguage}</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className="w-5 h-5 text-primary fill-primary"/>
            {typeof show.movie.vote_average === 'number' ? show.movie.vote_average.toFixed(1) : '8.0'} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>

          <p className='text-sm text-gray-300'>
            {timeFormat(show.movie.runtime || 150)} • {show.movie.genres?.map(genre => genre.name).join(", ") || 'Action, Drama'} • {show.movie.release_date?.split("-")[0] || '2026'}
          </p>

          {!hasUpcomingShows && (
            <div className='flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs w-max mt-2'>
              <AlertCircle className="w-4 h-4"/>
              No configured showtimes currently active for this title.
            </div>
          )}

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className="w-5 h-5"/>
              Watch Trailer
            </button>

            {hasUpcomingShows ? (
              <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>
                Buy Tickets
              </a>
            ) : (
              <button disabled className='px-8 py-3 text-sm bg-gray-800 text-gray-400 border border-gray-700 rounded-md font-medium cursor-not-allowed' title='Showtimes not configured'>
                Showtimes Unavailable
              </button>
            )}

            <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-primary text-primary' : ""} `}/>
            </button>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Star Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {(show.movie.casts || []).slice(0,12).map((cast,index)=> (
            <div key={index} className='flex flex-col items-center text-center'>
              <img
                src={tmdbImg(cast.profile_path)}
                alt={cast.name}
                onError={(e) => { e.currentTarget.src = '/profile.png'; }}
                className='rounded-full h-20 md:h-20 aspect-square object-cover border border-gray-700 bg-gray-900'
              />
              <p className='font-medium text-xs mt-3 max-w-20 truncate'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id}/>

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {(shows || []).slice(0,4).map((movie, index)=> (
            <MovieCard key={index} movie={movie}/>
          ))}
      </div>
      <div className='flex justify-center mt-20'>
          <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show more</button>
      </div>

    </div>
  )
}

export default MovieDetails
