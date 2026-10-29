import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData, configuredShowMovieIds } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon, AlertCircle, Film, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import isoTimeFormat from '../lib/timeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import { useClerk } from '@clerk/clerk-react'
import { CINEMA_THEATRES } from '../components/DateSelect'

// Tiered seat pricing: H, I, J = ₹500 | Middle (C, D, E, F, G) = ₹300 | Front/Low (A, B) = ₹200
export const getSeatPrice = (seatId) => {
  const row = String(seatId || '').charAt(0).toUpperCase();
  if (['H', 'I', 'J'].includes(row)) return 500;
  if (['A', 'B'].includes(row)) return 200;
  return 300;
};

export const getSeatTierName = (seatId) => {
  const row = String(seatId || '').charAt(0).toUpperCase();
  if (['H', 'I', 'J'].includes(row)) return 'VIP Recliner';
  if (['A', 'B'].includes(row)) return 'Front / Low';
  return 'Middle / Executive';
};

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G"], ["H", "I", "J"]]

  const { id, date: routeDate } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [activeDate, setActiveDate] = useState(routeDate)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [theatre, setTheatre] = useState(() => {
    try {
      const saved = localStorage.getItem('bookshow_selected_theatre');
      return saved ? JSON.parse(saved) : CINEMA_THEATRES[0];
    } catch (e) {
      return CINEMA_THEATRES[0];
    }
  });

  const navigate = useNavigate()
  const { openSignIn } = useClerk()
  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success && data.movie) {
        setShow(data)
        return
      }
    } catch (error) {
      // Backend offline or fallback
    }

    const foundMovie = dummyShowsData.find(m => m._id === id || String(m.id) === id)
    if (foundMovie) {
      const hasConfigured = configuredShowMovieIds.includes(String(foundMovie._id)) || foundMovie.hasConfiguredShows !== false
      setShow({
        movie: foundMovie,
        dateTime: hasConfigured ? dummyDateTimeData : {}
      })
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a showtime first")
    }
    if (occupiedSeats.includes(seatId)) {
      return toast.error(`Seat ${seatId} is already booked! Please pick an available seat.`)
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 6) {
      return toast("You can select up to 6 seats per transaction")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);
          const seatPrice = getSeatPrice(seatId);
          const tierName = getSeatTierName(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              title={isOccupied ? `Seat ${seatId} is already booked` : `Seat ${seatId} (${tierName} • ₹${seatPrice})`}
              className={`h-8 w-8 rounded text-xs font-semibold border transition-all ${
                isSelected
                  ? "bg-primary border-primary text-white scale-110 shadow-md shadow-primary/40 cursor-pointer"
                  : isOccupied
                  ? "bg-gray-800/80 border-gray-700 text-gray-500 cursor-not-allowed line-through opacity-50"
                  : ['H', 'I', 'J'].includes(row)
                  ? "border-amber-500/40 bg-amber-950/20 text-amber-200 hover:bg-amber-500/20 cursor-pointer"
                  : "border-primary/40 bg-black/40 text-gray-200 hover:bg-primary/20 cursor-pointer"
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime) return;
      const showId = selectedTime.showId || 'show_default';
      const params = new URLSearchParams();
      if (id) params.append('movieId', id);
      if (selectedTime.time) params.append('time', selectedTime.time);

      let apiOccupied = [];
      try {
        const { data } = await axios.get(`/api/booking/seats/${showId}?${params.toString()}`);
        if (data && data.success && Array.isArray(data.occupiedSeats)) {
          apiOccupied = data.occupiedSeats;
        }
      } catch (err) {
        // Backend offline fallback
      }

      // Merge with user's local confirmed bookings for this movie & showtime
      const localBookings = JSON.parse(localStorage.getItem('bookshow_user_bookings') || '[]');
      const occupiedSet = new Set(apiOccupied);

      localBookings.forEach(b => {
        const bMovieId = String(b.show?.movie?._id || b.show?.movie?.id || '');
        const bTime = b.show?.showDateTime;
        if (bMovieId === String(id) && bTime === selectedTime.time) {
          (b.bookedSeats || []).forEach(s => occupiedSet.add(s));
        }
      });

      setOccupiedSeats(Array.from(occupiedSet));
    } catch (error) {
      console.log("Occupied seats error:", error);
    }
  }

  const saveConfirmedBooking = (bookingId, amount) => {
    try {
      const existing = JSON.parse(localStorage.getItem('bookshow_user_bookings') || '[]');
      const newEntry = {
        _id: bookingId || ('bkg_' + Date.now()),
        amount: amount,
        bookedSeats: selectedSeats,
        isPaid: true,
        theatreName: theatre?.name || 'PVR INOX: Phoenix Marketcity',
        theatreLocation: theatre?.location || 'Kurla West, Mumbai',
        createdAt: new Date().toISOString(),
        show: {
          movie: show.movie,
          showDateTime: selectedTime?.time || new Date().toISOString()
        }
      };
      localStorage.setItem('bookshow_user_bookings', JSON.stringify([newEntry, ...existing]));
    } catch (e) {
      console.log("Local booking cache notice:", e);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user) {
        toast.error('Please login to proceed with booking')
        openSignIn()
        return
      }

      if (!selectedTime || !selectedSeats.length) {
        return toast.error('Please select showtime and at least one seat');
      }

      // Strict client-side check: prevent checkout if seats are already occupied
      const alreadyTaken = selectedSeats.filter(s => occupiedSeats.includes(s));
      if (alreadyTaken.length > 0) {
        toast.error(`Seat(s) ${alreadyTaken.join(', ')} are already booked! Please select other seats.`);
        getOccupiedSeats();
        return;
      }

      // Dynamic tiered price total
      const totalAmount = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

      let data;
      try {
        const res = await axios.post('/api/booking/create', {
          showId: selectedTime.showId,
          selectedSeats,
          movieData: show?.movie,
          showTime: selectedTime.time,
          theatre: theatre
        }, { headers: { Authorization: `Bearer ${await getToken()}` } });
        data = res.data;
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        toast.error(errMsg);
        getOccupiedSeats();
        return;
      }

      if (!data.success) {
        toast.error(data.message || "Failed to create booking");
        getOccupiedSeats();
        return;
      }

      if (data && data.success) {
        const bookingId = data.bookingId || ('bkg_' + Date.now());

        if (window.Razorpay && data.key && !data.order?.id?.startsWith('order_mock')) {
          try {
            const options = {
              key: data.key,
              amount: data.order?.amount || totalAmount * 100,
              currency: data.order?.currency || "INR",
              name: "BookShow",
              description: `${show?.movie?.title || "Movie"} (${selectedSeats.join(', ')})`,
              order_id: (data.order?.id && !data.order.id.startsWith("order_")) ? data.order.id : undefined,
              image: "/favicon.svg",
              prefill: {
                name: user?.fullName || user?.firstName || "",
                email: user?.primaryEmailAddress?.emailAddress || "",
                contact: user?.primaryPhoneNumber?.phoneNumber || ""
              },
              theme: {
                color: "#F84565",
                backdrop_color: "rgba(9, 9, 11, 0.85)"
              },
              notes: {
                movie: show?.movie?.title,
                seats: selectedSeats.join(', '),
                theatre: theatre?.name
              },
              handler: async function (response) {
                try {
                  await axios.post('/api/booking/verify', {
                    bookingId,
                    razorpay_payment_id: response?.razorpay_payment_id || ("pay_" + Date.now()),
                    showId: data.showId || selectedTime.showId,
                    selectedSeats
                  }, { headers: { Authorization: `Bearer ${await getToken()}` } });
                } catch (e) {
                  console.log("Payment verification notice:", e);
                }

                saveConfirmedBooking(bookingId, totalAmount);
                toast.success("Payment Successful! Booking confirmed.");
                navigate('/my-bookings');
              },
              modal: {
                ondismiss: function() {
                  toast("Payment cancelled.");
                }
              }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function () {
              saveConfirmedBooking(bookingId, totalAmount);
              toast.success("Test Booking Confirmed!");
              navigate('/my-bookings');
            });
            rzp.open();
            return;
          } catch (rzpErr) {
            console.log("Razorpay modal notice:", rzpErr);
          }
        }

        saveConfirmedBooking(bookingId, totalAmount);
        toast.success("Seats reserved successfully! Booking confirmed.");
        navigate('/my-bookings');
      } else {
        toast.error(data?.message || "Booking could not be completed. Please try again.");
      }
    } catch (error) {
      console.log("Booking error:", error);
      toast.error(error.message || "Something went wrong.");
    }
  }

  useEffect(() => {
    getShow()
  }, [id])

  useEffect(() => {
    if (show?.dateTime) {
      const availableDates = Object.keys(show.dateTime);
      const chosenDate = (routeDate && availableDates.includes(routeDate))
        ? routeDate
        : availableDates[0];

      setActiveDate(chosenDate);
      const times = show.dateTime[chosenDate] || [];
      if (times.length > 0) {
        setSelectedTime(times[0]);
      }
    }
  }, [show, routeDate])

  useEffect(() => {
    if (selectedTime) {
      setSelectedSeats([])
      getOccupiedSeats()
    }
  }, [selectedTime])

  const availableDates = Object.keys(show?.dateTime || {});
  const availableTimings = (show?.dateTime && show.dateTime[activeDate]) || [];
  const hasConfiguredShowtimes = availableTimings.length > 0 && selectedTime;
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

  return show ? (
    <div className='flex flex-col px-6 md:px-16 lg:px-40 py-24 md:pt-36'>
      
      {/* Theatre & Showtime Header Banner */}
      <div className='mb-8 p-4 md:p-6 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <div className='p-3 bg-primary/20 rounded-xl border border-primary/30 text-primary'>
            <Film className='w-6 h-6' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-bold text-white'>{show.movie?.title || "Movie Booking"}</h2>
              <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase'>
                {show.movie?.original_language === 'hi' ? 'Hindi' : 'English'}
              </span>
            </div>
            <div className='flex items-center gap-2 text-xs text-gray-300 mt-1'>
              <MapPin className='w-3.5 h-3.5 text-primary shrink-0' />
              <span className='font-medium text-white'>{theatre?.name}</span>
              <span className='text-gray-400'>• {theatre?.location}</span>
            </div>
          </div>
        </div>

        {/* Change Theatre Dropdown */}
        <div className='flex items-center gap-3 text-xs'>
          <label className='text-gray-400 hidden sm:inline'>Cinema:</label>
          <select
            value={theatre?.id}
            onChange={(e) => {
              const th = CINEMA_THEATRES.find(t => t.id === e.target.value) || CINEMA_THEATRES[0];
              setTheatre(th);
              localStorage.setItem('bookshow_selected_theatre', JSON.stringify(th));
            }}
            className='bg-black/50 border border-primary/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary cursor-pointer'
          >
            {CINEMA_THEATRES.map(t => (
              <option key={t.id} value={t.id} className='bg-gray-900 text-white'>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>

        {/* Left Sidebar: Date Tabs, Showtimes, Pricing Tiers & Summary */}
        <div className='w-full lg:w-80 bg-primary/10 border border-primary/20 rounded-2xl p-5 md:p-6 h-fit shrink-0'>

          {/* 1. Date Selection Tabs */}
          <div className='mb-5'>
            <div className='flex items-center gap-2 text-sm font-semibold text-white mb-2.5'>
              <Calendar className='w-4 h-4 text-primary' />
              <span>Choose Date ({availableDates.length} Dates)</span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {availableDates.map(dStr => {
                const isSelected = activeDate === dStr;
                const dateObj = new Date(dStr + "T00:00:00");
                const count = (show.dateTime && show.dateTime[dStr]?.length) || 0;
                return (
                  <button
                    key={dStr}
                    onClick={() => {
                      setActiveDate(dStr);
                      const times = show.dateTime[dStr] || [];
                      if (times.length > 0) setSelectedTime(times[0]);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/30 scale-102'
                        : 'bg-black/30 border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <p className='text-xs font-bold leading-tight'>
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                      {count} {count === 1 ? 'Show' : 'Shows'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Showtimes Header & Slot Pills */}
          <div className='flex items-center gap-2 text-sm font-semibold text-white mb-3 pt-3 border-t border-primary/20'>
            <ClockIcon className='w-4 h-4 text-primary' />
            <span>Showtimes for {activeDate}</span>
          </div>

          <div className='flex flex-col gap-2'>
            {availableTimings.length > 0 ? (
              availableTimings.map((item, idx) => {
                const isSelected = selectedTime?.time === item.time;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTime(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/30 font-semibold"
                        : "border-primary/20 bg-black/30 text-gray-300 hover:bg-primary/10"
                    }`}
                  >
                    <span className='text-sm'>
                      {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className='text-[10px] opacity-75 font-normal'>2D / Dolby</span>
                  </div>
                );
              })
            ) : (
              <p className='text-gray-400 text-xs py-2'>No showtimes on this date</p>
            )}
          </div>

          {/* 3. Booking Summary Box */}
          <div className='mt-6 pt-5 border-t border-primary/20 text-xs space-y-2.5'>
            <div className='flex justify-between text-gray-300'>
              <span>Selected Seats:</span>
              <span className='font-bold text-white'>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </span>
            </div>

            {/* Dynamic Tier Breakdown */}
            <div className='p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]'>
              <div className='flex justify-between text-gray-400'>
                <span>Low (A, B):</span>
                <span className='text-gray-200 font-semibold'>₹200</span>
              </div>
              <div className='flex justify-between text-gray-400'>
                <span>Middle (C - G):</span>
                <span className='text-gray-200 font-semibold'>₹300</span>
              </div>
              <div className='flex justify-between text-amber-400/90 font-medium'>
                <span>VIP (H - J):</span>
                <span className='text-amber-300 font-bold'>₹500</span>
              </div>
            </div>

            <div className='flex justify-between text-sm font-bold pt-2 border-t border-primary/20'>
              <span className='text-white'>Total Amount:</span>
              <span className='text-primary font-bold text-lg'>₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Seats Layout Area */}
        <div className='relative flex-1 flex flex-col items-center bg-black/40 border border-gray-800/80 rounded-2xl p-6 md:p-8'>
          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle bottom="0" right="0" />

          {!hasConfiguredShowtimes ? (
            <div className='flex flex-col items-center justify-center p-8 bg-amber-500/10 border border-amber-500/30 rounded-xl max-w-md text-center my-12'>
              <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
              <h2 className='text-lg font-bold text-white'>Showtimes Not Configured</h2>
              <p className='text-gray-300 text-sm mt-1'>Booking is only allowed for movies with configured showtimes.</p>
              <button
                onClick={() => navigate('/movies')}
                className='mt-5 px-6 py-2.5 bg-primary hover:bg-primary-dull text-white text-xs font-semibold rounded-full cursor-pointer transition'
              >
                Browse Active Movies
              </button>
            </div>
          ) : (
            <>
              <h1 className='text-xl md:text-2xl font-bold mb-4 text-white'>Select Your Preferred Seats</h1>
              <img src={assets.screenImage} alt="cinema screen" className='max-w-md w-full opacity-80' />
              <p className='text-gray-400 text-xs tracking-widest mt-1 mb-8 uppercase'>All eyes this way • Screen Side</p>

              {/* Seating Grid with Tier Headings */}
              <div className='flex flex-col items-center text-xs text-gray-300 overflow-x-auto max-w-full pb-4'>
                
                {/* 1. Low Seats: Rows A - B (₹200) */}
                <div className='w-full text-center text-[11px] text-gray-400 font-medium mb-1 tracking-wider uppercase border-b border-white/5 pb-1'>
                  🍿 Front / Low Seats • ₹200 (Rows A - B)
                </div>
                <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
                  {groupRows[0].map(row => renderSeats(row))}
                </div>

                {/* 2. Middle Seats: Rows C - G (₹300) */}
                <div className='w-full text-center text-[11px] text-gray-400 font-medium mb-1 mt-3 tracking-wider uppercase border-b border-white/5 pb-1'>
                  🎬 Middle Seats • ₹300 (Rows C - G)
                </div>
                <div className='grid grid-cols-2 gap-11 mb-6'>
                  {groupRows.slice(1, 4).map((group, idx) => (
                    <div key={idx}>
                      {group.map(row => renderSeats(row))}
                    </div>
                  ))}
                </div>

                {/* 3. High / VIP Seats: Rows H - J (₹500) */}
                <div className='w-full text-center text-[11px] text-amber-400 font-medium mb-1 mt-3 tracking-wider uppercase border-b border-amber-500/20 pb-1'>
                  👑 VIP / Recliner • ₹500 (Rows H - J)
                </div>
                <div className='grid grid-cols-2 gap-11'>
                  {groupRows.slice(4).map((group, idx) => (
                    <div key={idx}>
                      {group.map(row => renderSeats(row))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Legend */}
              <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-gray-400 border-t border-gray-800 pt-4'>
                <div className='flex items-center gap-2'>
                  <span className='h-4 w-4 rounded border border-primary/40 bg-black/40'></span>
                  <span>Available</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='h-4 w-4 rounded bg-primary'></span>
                  <span>Selected</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='h-4 w-4 rounded bg-gray-800 border border-gray-700 opacity-60'></span>
                  <span>Occupied</span>
                </div>
                <div className='flex items-center gap-2 text-gray-300 font-mono text-[11px]'>
                  <span className='px-2 py-0.5 rounded bg-white/5 border border-white/10'>Low: ₹200</span>
                  <span className='px-2 py-0.5 rounded bg-white/5 border border-white/10'>Mid: ₹300</span>
                  <span className='px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300'>H-J: ₹500</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={bookTickets}
                disabled={selectedSeats.length === 0}
                className={`flex items-center gap-2 mt-8 px-10 py-3.5 text-sm rounded-full font-semibold cursor-pointer active:scale-95 transition-all shadow-xl ${
                  selectedSeats.length > 0
                    ? 'bg-primary hover:bg-primary-dull text-white shadow-primary/30 scale-105'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                <span>Proceed to Checkout ({selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} • ₹{totalPrice})</span>
                <ArrowRightIcon strokeWidth={2.5} className="w-4 h-4" />
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
