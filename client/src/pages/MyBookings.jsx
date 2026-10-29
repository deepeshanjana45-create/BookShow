import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const tmdbPoster = (path) => {
  if (!path) return '/profile.png'
  if (path.startsWith('http')) return path
  return `https://image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`
}

const tmdbPosterFallback = (path) => {
  if (!path) return '/profile.png'
  return `https://images.weserv.nl/?url=image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`
}

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'

  const { axios, getToken, user } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch confirmed user bookings from MongoDB, merged with recent local bookings
  const getMyBookings = async () => {
    let serverBookings = []
    try {
      const token = await getToken()
      if (token) {
        // Retrieve bookings saved in MongoDB for the logged-in Clerk user
        const { data } = await axios.get('/api/user/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success && Array.isArray(data.bookings)) {
          serverBookings = data.bookings
        }
      }
    } catch (error) {
      console.log("Server bookings fetch notice:", error.message)
    }

    // Merge with any recent confirmed bookings saved locally so tickets appear instantly
    let localBookings = []
    try {
      localBookings = JSON.parse(localStorage.getItem('bookshow_user_bookings') || '[]')
    } catch (e) {}

    // Deduplicate bookings by ID or unique show-seat combination
    const seen = new Set()
    const combined = []
    for (const b of [...serverBookings, ...localBookings]) {
      const key = b._id || `${b.show?.movie?._id}_${b.bookedSeats?.join('-')}`
      if (!seen.has(key)) {
        seen.add(key)
        combined.push(b)
      }
    }

    setBookings(combined)
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      getMyBookings()
    } else {
      setIsLoading(false)
    }
  }, [user])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-2xl font-semibold mb-6 text-white'>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-12 bg-gray-900/60 border border-gray-800 rounded-2xl max-w-xl text-center'>
          <p className='text-gray-300 text-base'>No bookings found yet.</p>
          <Link to='/' className='mt-5 px-6 py-2.5 bg-primary hover:bg-primary-dull text-white text-xs font-semibold rounded-full transition'>
            Browse Movies
          </Link>
        </div>
      ) : (
        bookings.map((item, index) => {
          const rawPoster = item.show?.movie?.poster_path || item.show?.movie?.backdrop_path
          return (
            <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/10 border border-primary/25 rounded-xl mt-4 p-4 max-w-3xl shadow-lg'>
              <div className='flex flex-col md:flex-row gap-4'>
                <img
                  src={tmdbPoster(rawPoster)}
                  alt={item.show?.movie?.title || "Movie"}
                  onError={(e) => { e.currentTarget.src = tmdbPosterFallback(rawPoster); }}
                  className='md:max-w-44 aspect-video h-auto object-cover object-center rounded-lg bg-gray-900'
                />
                <div className='flex flex-col justify-between py-1'>
                  <div>
                    <p className='text-lg font-bold text-white'>{item.show?.movie?.title || "Indian Blockbuster"}</p>
                    <p className='text-gray-400 text-xs mt-0.5'>{timeFormat(item.show?.movie?.runtime || 150)}</p>
                    <p className='text-primary text-xs mt-1 font-medium'>
                      {item.theatreName || 'PVR INOX: Phoenix Marketcity'} {item.theatreLocation ? `• ${item.theatreLocation}` : ''}
                    </p>
                  </div>
                  <p className='text-gray-300 text-xs mt-3'>
                    {item.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'Upcoming'}
                  </p>
                </div>
              </div>

              <div className='flex flex-col md:items-end md:text-right justify-between pt-4 md:pt-0'>
                <div className='flex items-center gap-4'>
                  <p className='text-2xl font-bold text-primary'>{currency}{item.amount}</p>
                  <span className='px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold rounded-full'>
                    {item.isPaid ? 'Confirmed' : 'Reserved'}
                  </span>
                </div>
                <div className='text-xs mt-3 text-gray-300'>
                  <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats?.length || 1}</p>
                  <p className='mt-0.5'><span className='text-gray-400'>Seats:</span> {item.bookedSeats?.join(", ") || 'General'}</p>
                </div>
              </div>

            </div>
          )
        })
      )}

    </div>
  ) : <Loading />
}

export default MyBookings
