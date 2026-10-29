import React, { useEffect, useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon, MapPin, Film, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const CINEMA_THEATRES = [
  { id: 'pvr-marketcity', name: 'PVR INOX: Phoenix Marketcity', location: 'Kurla West, Mumbai', screens: 'Dolby Atmos 4K' },
  { id: 'cinepolis-viviana', name: 'Cinépolis: Viviana Mall', location: 'Thane West', screens: 'IMAX Laser 3D' },
  { id: 'inox-inorbit', name: 'INOX Megaplex: Inorbit Mall', location: 'Malad West', screens: 'Insignia 7.1' },
  { id: 'miraj-maxus', name: 'Miraj Cinemas: Maxus Mall', location: 'Bhayander West', screens: 'RGB Laser' }
];

const DateSelect = ({ dateTime, id }) => {

  const navigate = useNavigate();
  const dates = Object.keys(dateTime || {});

  const [selectedTheatre, setSelectedTheatre] = useState(CINEMA_THEATRES[0]);
  const [selected, setSelected] = useState(dates[0] || null);

  useEffect(() => {
    const availableDates = Object.keys(dateTime || {});
    if (availableDates.length > 0 && (!selected || !availableDates.includes(selected))) {
      setSelected(availableDates[0]);
    } else if (availableDates.length === 0) {
      setSelected(null);
    }
  }, [dateTime]);

  const onBookHandler = () => {
    if (dates.length === 0) {
      return toast.error('Booking is only allowed for movies with configured showtimes');
    }
    if (!selected || selected === 'undefined') {
      return toast.error('Please select a date');
    }
    // Save selected theatre for the booking flow
    localStorage.setItem('bookshow_selected_theatre', JSON.stringify(selectedTheatre));
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  }

  return (
    <div id='dateSelect' className='pt-20'>
      <div className='relative p-6 md:p-8 bg-primary/10 border border-primary/20 rounded-2xl backdrop-blur-md shadow-2xl'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        {/* 1. Cinema Theatre Selection */}
        <div className='mb-8'>
          <div className='flex items-center gap-2 mb-3'>
            <Film className='w-5 h-5 text-primary' />
            <h3 className='text-lg font-semibold text-white'>1. Select Cinema Theatre</h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
            {CINEMA_THEATRES.map((theatre) => {
              const isSelected = selectedTheatre.id === theatre.id;
              return (
                <div
                  key={theatre.id}
                  onClick={() => setSelectedTheatre(theatre)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected
                      ? 'bg-primary/20 border-primary shadow-md shadow-primary/20'
                      : 'bg-black/30 border-gray-800 hover:border-gray-700'
                    }`}
                >
                  <p className='text-sm font-semibold text-white truncate'>{theatre.name}</p>
                  <div className='flex items-center gap-1 text-xs text-gray-400 mt-1'>
                    <MapPin className='w-3 h-3 text-primary shrink-0' />
                    <span className='truncate'>{theatre.location}</span>
                  </div>
                  <span className='inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30'>
                    {theatre.screens}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Date Selection */}
        <div>
          <div className='flex items-center gap-2 mb-3'>
            <Calendar className='w-5 h-5 text-primary' />
            <h3 className='text-lg font-semibold text-white'>2. Choose Date</h3>
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
            <div className='flex items-center gap-3 text-sm'>
              <span className='flex flex-wrap gap-3'>
                {dates.length > 0 ? (
                  dates.map((date) => (
                    <button
                      onClick={() => setSelected(date)}
                      key={date}
                      className={`flex flex-col items-center justify-center h-16 w-16 rounded-xl cursor-pointer transition-all ${selected === date
                          ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                          : "border border-primary/40 bg-black/40 hover:bg-primary/10 text-gray-300"
                        }`}
                    >
                      <span className='font-bold text-base'>{new Date(date).getDate()}</span>
                      <span className='text-xs font-medium uppercase'>{new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-2">No showtimes configured for this movie.</p>
                )}
              </span>
            </div>

            {dates.length > 0 ? (
              <button
                onClick={onBookHandler}
                className='w-full sm:w-auto bg-primary hover:bg-primary-dull text-white px-8 py-3.5 rounded-xl transition-all cursor-pointer font-semibold active:scale-95 shadow-xl shadow-primary/30 flex items-center justify-center gap-2'
              >
                <span>Select Showtime & Seats</span>
              </button>
            ) : (
              <button
                disabled
                className='w-full sm:w-auto bg-gray-800 text-gray-500 border border-gray-700 px-8 py-3.5 rounded-xl cursor-not-allowed font-medium'
              >
                Booking Unavailable
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DateSelect
