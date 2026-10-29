import React, { useState } from 'react';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Film, Sparkles, Ticket, ChevronRight, Star, Volume2, Search, CheckCircle } from 'lucide-react';

export const THEATRES_LIST = [
  {
    id: 'pvr-marketcity',
    name: 'PVR INOX: Phoenix Marketcity',
    location: 'Kurla West, Mumbai',
    screens: 'Dolby Atmos 4K',
    brand: 'PVR INOX',
    rating: 4.6,
    features: ['Dolby Atmos 4K', 'Luxury Recliners', 'Gourmet Food', 'Free Valet'],
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    description: 'Experience premier cinema entertainment featuring cutting-edge laser projection and immersive 64-channel Dolby Atmos sound.'
  },
  {
    id: 'cinepolis-viviana',
    name: 'Cinépolis: Viviana Mall',
    location: 'Thane West, Mumbai',
    screens: 'IMAX Laser 3D',
    brand: 'Cinépolis',
    rating: 4.7,
    features: ['IMAX Laser 3D', '4DX Sensory Experience', 'Coffee Tree Deli', 'VIP Lounge'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    description: 'Home to majestic IMAX Laser screens with heart-pounding audio and next-generation 4DX sensory motion seats.'
  },
  {
    id: 'inox-inorbit',
    name: 'INOX Megaplex: Inorbit Mall',
    location: 'Malad West, Mumbai',
    screens: 'Insignia 7.1',
    brand: 'INOX',
    rating: 4.5,
    features: ['Insignia 7.1', 'Kiddles Fun Screen', 'Chef Curated Menu', 'Dolby 7.1'],
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80',
    description: 'A 11-screen megaplex with dedicated Insignia luxury auditoriums and customized gourmet culinary dining.'
  },
  {
    id: 'miraj-maxus',
    name: 'Miraj Cinemas: Maxus Mall',
    location: 'Bhayander West, Mumbai',
    screens: 'RGB Laser',
    brand: 'Miraj',
    rating: 4.3,
    features: ['RGB Pure Laser', 'Push Back Seating', 'Live Kitchen', 'Pocket Friendly'],
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    description: 'Modern multiplex offering ultra-crisp RGB laser imagery and comfortable pushback seating at unbeatable prices.'
  },
  {
    id: 'pvr-gold-palladium',
    name: 'PVR Gold Class: Palladium Mall',
    location: 'Lower Parel, Mumbai',
    screens: 'Dolby Vision & Atmos',
    brand: 'PVR Gold',
    rating: 4.9,
    features: ['Ultra-Luxury Recliners', 'Butler Service', 'Dolby Vision 4K', 'Fine Dining Lounge'],
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=800&q=80',
    description: 'The pinnacle of five-star movie luxury with full-flat motorized recliners and at-your-seat butler service.'
  },
  {
    id: 'carnival-imax-wadala',
    name: 'Carnival IMAX: Wadala Dome',
    location: 'Wadala East, Mumbai',
    screens: 'Gigantic IMAX 70mm',
    brand: 'Carnival IMAX',
    rating: 4.4,
    features: ['Giant 70mm IMAX Screen', 'Stadium Seating', 'Ample Parking', 'Dolby Sound'],
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    description: 'One of India’s largest iconic dome-style cinema auditoriums built for colossal cinematic spectacles.'
  }
];

const Theaters = () => {
  const { shows, image_base_url } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');

  const brands = ['All', 'PVR INOX', 'Cinépolis', 'INOX', 'Miraj', 'PVR Gold', 'Carnival IMAX'];

  const filteredTheatres = THEATRES_LIST.filter(theatre => {
    if (selectedBrand !== 'All' && theatre.brand !== selectedBrand) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        theatre.name.toLowerCase().includes(q) ||
        theatre.location.toLowerCase().includes(q) ||
        theatre.screens.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBookMovieAtTheatre = (theatre, movie) => {
    localStorage.setItem('bookshow_selected_theatre', JSON.stringify({
      id: theatre.id,
      name: theatre.name,
      location: theatre.location,
      screens: theatre.screens
    }));
    navigate(`/movies/${movie._id || movie.id}`);
    scrollTo(0, 0);
  };

  return (
    <div className='relative pt-32 pb-36 px-6 md:px-16 lg:px-24 xl:px-32 min-h-screen'>
      <BlurCircle top="100px" left="0px" />
      <BlurCircle bottom="200px" right="50px" />

      {/* Header */}
      <div className='max-w-3xl mb-10'>
        <h1 className='text-3xl md:text-5xl font-extrabold text-white tracking-tight'>
          Find Theatres & <span className='text-primary'>Premium Screens</span>
        </h1>
        <p className='text-gray-400 mt-3 text-sm md:text-base leading-relaxed'>
          Explore top cinema halls near you. Experience Dolby Atmos 4K, IMAX Laser, Insignia dining, and book tickets with reserved seating.
        </p>
      </div>

      {/* Search and Brand Filters */}
      <div className='flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10'>
        {/* Search Bar */}
        <div className='relative flex-1 max-w-md'>
          <Search className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search theatre by name, mall or location...'
            className='w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition'
          />
        </div>

        {/* Brand Filter Pills */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none'>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                selectedBrand === brand
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Theatres Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {filteredTheatres.map(theatre => (
          <div
            key={theatre.id}
            className='group bg-primary/5 border border-primary/20 rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between'
          >
            <div>
              {/* Card Banner Image & Badges */}
              <div className='relative h-48 w-full overflow-hidden bg-black'>
                <img
                  src={theatre.image}
                  alt={theatre.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-75 group-hover:opacity-90'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

                <div className='absolute top-3 left-3 flex items-center gap-2'>
                  <span className='px-2.5 py-1 rounded-md text-[11px] font-bold bg-primary text-white shadow-md'>
                    {theatre.screens}
                  </span>
                </div>

                <div className='absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30'>
                  <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                  <span>{theatre.rating}</span>
                </div>

                <div className='absolute bottom-3 left-4 right-4'>
                  <h2 className='text-xl font-bold text-white tracking-wide truncate'>
                    {theatre.name}
                  </h2>
                  <div className='flex items-center gap-1.5 text-xs text-gray-300 mt-1'>
                    <MapPin className='w-3.5 h-3.5 text-primary shrink-0' />
                    <span>{theatre.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Body & Features */}
              <div className='p-5'>
                <p className='text-xs text-gray-400 leading-relaxed mb-4'>
                  {theatre.description}
                </p>

                {/* Amenities Badges */}
                <div className='flex flex-wrap gap-2 mb-5'>
                  {theatre.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className='inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300'
                    >
                      <CheckCircle className='w-3 h-3 text-emerald-400 shrink-0' />
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Now Playing Movies preview for this theatre */}
                <div>
                  <h4 className='text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5'>
                    <Film className='w-3.5 h-3.5 text-primary' />
                    Now Showing at this Venue:
                  </h4>
                  <div className='flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none'>
                    {(shows || []).slice(0, 4).map(movie => (
                      <div
                        key={movie._id || movie.id}
                        onClick={() => handleBookMovieAtTheatre(theatre, movie)}
                        className='flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-black/40 border border-white/10 hover:border-primary/50 cursor-pointer transition shrink-0 max-w-[200px]'
                      >
                        {movie.poster_path ? (
                          <img
                            src={image_base_url ? `${image_base_url}${movie.poster_path}` : movie.poster_path}
                            alt={movie.title}
                            className='w-7 h-10 object-cover rounded shadow'
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className='w-7 h-10 bg-primary/20 rounded flex items-center justify-center text-[8px] text-gray-400'>
                            Movie
                          </div>
                        )}
                        <div className='overflow-hidden'>
                          <p className='text-xs font-medium text-white truncate'>{movie.title}</p>
                          <span className='text-[10px] text-primary flex items-center gap-0.5 mt-0.5'>
                            Book <ChevronRight className='w-2.5 h-2.5' />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className='p-5 pt-0 mt-2 flex items-center justify-between border-t border-white/5'>
              <div className='text-xs text-gray-400'>
                Instant confirmation & mobile m-ticket
              </div>
              <button
                onClick={() => {
                  if (shows && shows.length > 0) {
                    handleBookMovieAtTheatre(theatre, shows[0]);
                  } else {
                    navigate('/movies');
                  }
                }}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dull text-white text-xs font-semibold transition shadow-md shadow-primary/20 active:scale-95 cursor-pointer'
              >
                <Ticket className='w-3.5 h-3.5' />
                Select Showtime
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theaters;

