import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, Trash2, StarIcon, Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const FALLBACK_ADMIN_MOVIES = [
    {
        id: "1269325",
        title: "Drishyam: The Conclusion",
        poster_path: "/67FsF2kpgEZ1T5Qos4adgqm9dLf.jpg",
        backdrop_path: "/nq73eRdEooripf3k0XHLtX14zyC.jpg",
        release_date: "2026-10-02",
        original_language: "hi",
        vote_average: 7.6,
        vote_count: 110,
        overview: "Vijay Salgaonkar returns to defend his family in a thrilling battle of wits."
    },
    {
        id: "552524",
        title: "Lilo & Stitch",
        poster_path: "/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg",
        backdrop_path: "/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
        release_date: "2025-05-17",
        original_language: "en",
        vote_average: 7.4,
        vote_count: 530,
        overview: "The live-action story of a Hawaiian girl and her fugitive alien friend."
    },
    {
        id: "1375156",
        title: "Udta Teer",
        poster_path: "/tvICKypVlW7Iio4KVs7NousbSKi.jpg",
        backdrop_path: "/ncVecUcDZe1EOWtHaU2f8BFvbx4.jpg",
        release_date: "2026-10-23",
        original_language: "hi",
        vote_average: 7.5,
        vote_count: 85,
        overview: "A spy wakes up with amnesia in hilarious cross-border chaos."
    },
    {
        id: "668489",
        title: "Havoc",
        poster_path: "/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg",
        backdrop_path: "/65MVgDa6YjSdqzh7YOA04mYkioo.jpg",
        release_date: "2025-04-25",
        original_language: "en",
        vote_average: 7.3,
        vote_count: 320,
        overview: "A jaded cop fights his way through the criminal underworld."
    },
    {
        id: "1654581",
        title: "Nayyi Navelli",
        poster_path: "/aZEKuzGt7ObqoKjTM4kcMd0klYy.jpg",
        backdrop_path: "/3aXMkyp0Pv2WGyvm2NUdtMXwY2P.jpg",
        release_date: "2026-10-16",
        original_language: "hi",
        vote_average: 6.8,
        vote_count: 70,
        overview: "A new bride's arrival turns a turbulent household in Meerut into harmony."
    },
    {
        id: "1263337",
        title: "Heart of the Beast",
        poster_path: "/67FsF2kpgEZ1T5Qos4adgqm9dLf.jpg",
        backdrop_path: "/nq73eRdEooripf3k0XHLtX14zyC.jpg",
        release_date: "2026-10-29",
        original_language: "en",
        vote_average: 7.2,
        vote_count: 90,
        overview: "An intense high-stakes action thriller."
    },
    {
        id: "324544",
        title: "In the Lost Lands",
        poster_path: "/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg",
        backdrop_path: "/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
        release_date: "2025-02-27",
        original_language: "en",
        vote_average: 6.8,
        vote_count: 140,
        overview: "A sorceress ventures into the ghostly wilderness in search of magical power."
    },
    {
        id: "1232546",
        title: "Until Dawn",
        poster_path: "/juA4IWO52Fecx8lhAsxmDgy3M3.jpg",
        backdrop_path: "/icFWIk1KfkWLZnugZAJEDauNZ94.jpg",
        release_date: "2025-04-23",
        original_language: "en",
        vote_average: 6.9,
        vote_count: 210,
        overview: "Friends investigate a mysterious disappearance in a remote valley."
    },
    {
        id: "1772549",
        title: "Pehla Pyaar Doosri Baar",
        poster_path: "/tGS4b47RIpF3DTAkezHBqfYNTm2.jpg",
        backdrop_path: "/iaVcws1W3owTlRSI8GKcov95UHS.jpg",
        release_date: "2026-10-23",
        original_language: "hi",
        vote_average: 6.5,
        vote_count: 50,
        overview: "School reunion brings unexpected romance and second chances."
    }
];

const tmdbImg = (path) => {
    if (!path) return '/profile.png';
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`;
};

const AddShows = () => {

    const { axios, getToken } = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY || '₹'
    const [nowPlayingMovies, setNowPlayingMovies] = useState(FALLBACK_ADMIN_MOVIES);
    const [selectedMovie, setSelectedMovie] = useState("1269325");
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [customTime, setCustomTime] = useState("14:30");
    const [showPrice, setShowPrice] = useState("250");
    const [addingShow, setAddingShow] = useState(false);

    const standardTimePresets = ["10:00", "13:30", "17:00", "20:30"];

    const fetchNowPlayingMovies = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data && data.success && Array.isArray(data.movies) && data.movies.length > 0) {
                const filtered = data.movies.filter(m => ['en', 'hi'].includes(m.original_language?.toLowerCase()));
                setNowPlayingMovies(filtered.length > 0 ? filtered : FALLBACK_ADMIN_MOVIES);
            } else {
                setNowPlayingMovies(FALLBACK_ADMIN_MOVIES);
            }
        } catch (error) {
            setNowPlayingMovies(FALLBACK_ADMIN_MOVIES);
        }
    };

    const addSlot = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return;
        setDateTimeSelection(prev => {
            const times = prev[dateStr] || [];
            if (!times.includes(timeStr)) {
                return { ...prev, [dateStr]: [...times, timeStr].sort() };
            }
            return prev;
        });
        toast.success(`Slot ${timeStr} added for ${dateStr}`);
    };

    const addAllPresets = (dateStr) => {
        if (!dateStr) return;
        setDateTimeSelection(prev => {
            const existing = prev[dateStr] || [];
            const merged = Array.from(new Set([...existing, ...standardTimePresets])).sort();
            return { ...prev, [dateStr]: merged };
        });
        toast.success(`Added 4 showtimes for ${dateStr}!`);
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection((prev) => {
            const filteredTimes = (prev[date] || []).filter((t) => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [date]: filteredTimes,
            };
        });
    };

    const handleSubmit = async () => {
        try {
            if (!selectedMovie) {
                return toast.error('Please select a movie');
            }

            // If user has not queued any slots yet, auto-add custom time for selectedDate
            let currentSelection = { ...dateTimeSelection };
            if (Object.keys(currentSelection).length === 0) {
                if (selectedDate && customTime) {
                    currentSelection[selectedDate] = [customTime];
                } else {
                    return toast.error('Please add at least one showtime slot');
                }
            }

            if (!showPrice || Number(showPrice) <= 0) {
                return toast.error('Please enter a valid ticket price');
            }

            setAddingShow(true);

            const selectedMovieObj = nowPlayingMovies.find(m => String(m.id || m._id) === String(selectedMovie));
            const showsInput = Object.entries(currentSelection).map(([date, times]) => ({
                date,
                time: Array.isArray(times) ? times : [times]
            }));

            const totalSlotsCount = showsInput.reduce((acc, curr) => acc + curr.time.length, 0);

            const payload = {
                movieId: String(selectedMovie),
                movieData: selectedMovieObj,
                showsInput,
                showPrice: Number(showPrice)
            };

            const token = await getToken();
            const { data } = await axios.post('/api/show/add', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data && data.success) {
                toast.success(`Published ${totalSlotsCount} showtimes successfully!`);
                setDateTimeSelection({});
            } else {
                toast.error(data?.message || 'Could not add show');
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || 'An error occurred. Please try again.');
        } finally {
            setAddingShow(false);
        }
    }

    useEffect(() => {
        fetchNowPlayingMovies();
    }, []);

    const totalQueuedSlots = Object.values(dateTimeSelection).reduce((acc, curr) => acc + curr.length, 0);

    return (
        <div className="max-w-6xl pb-20">
            <Title text1="Add" text2="Shows" />

            {/* 1. Movie Selection */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-semibold text-white">1. Select Movie (English & Hindi)</p>
                    <span className="text-xs text-primary font-medium">Click any card</span>
                </div>

                <div className="overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex gap-4 w-max">
                        {nowPlayingMovies.map((movie) => {
                            const isSelected = String(selectedMovie) === String(movie.id || movie._id);
                            return (
                                <div
                                    key={movie.id || movie._id}
                                    onClick={() => setSelectedMovie(String(movie.id || movie._id))}
                                    className={`relative w-44 rounded-xl p-2 cursor-pointer transition-all border ${
                                        isSelected
                                            ? 'border-primary bg-primary/20 scale-105 shadow-xl shadow-primary/30'
                                            : 'border-gray-800 bg-black/40 hover:border-gray-700'
                                    }`}
                                >
                                    <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-gray-900">
                                        <img
                                            src={tmdbImg(movie.poster_path)}
                                            alt={movie.title}
                                            onError={(e) => { e.currentTarget.src = '/profile.png'; }}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="text-xs flex items-center justify-between p-2 bg-black/80 w-full absolute bottom-0 left-0">
                                            <p className="flex items-center gap-1 text-gray-300">
                                                <StarIcon className="w-3.5 h-3.5 text-primary fill-primary" />
                                                {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '7.5'}
                                            </p>
                                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary text-white">
                                                {movie.original_language === 'hi' ? 'Hindi' : 'English'}
                                            </span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-4 right-4 flex items-center justify-center bg-primary h-7 w-7 rounded-full shadow-lg border-2 border-white">
                                            <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                                        </div>
                                    )}

                                    <p className="font-semibold text-white text-sm truncate mt-2">{movie.title}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{movie.release_date?.split('-')[0] || '2026'}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. Ticket Price */}
            <div className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-xl">
                <label className="block text-sm font-semibold text-white mb-2">2. Ticket Price</label>
                <div className="inline-flex items-center gap-2 bg-black/50 border border-primary/40 px-4 py-2 rounded-lg">
                    <span className="text-primary font-bold text-base">{currency}</span>
                    <input
                        min={50}
                        type="number"
                        value={showPrice}
                        onChange={(e) => setShowPrice(e.target.value)}
                        placeholder="250"
                        className="bg-transparent outline-none text-white text-sm w-36 font-semibold"
                    />
                </div>
            </div>

            {/* 3. Date & Multi-Time Slot Configurator */}
            <div className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-xl">
                <label className="block text-sm font-semibold text-white mb-3">3. Choose Date & Showtimes</label>

                {/* Date Picker */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-black/60 border border-primary/40 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-primary" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-white text-sm outline-none cursor-pointer"
                        />
                    </div>

                    {/* Quick All-Day Button */}
                    <button
                        type="button"
                        onClick={() => addAllPresets(selectedDate)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dull text-white text-xs font-semibold rounded-lg transition shadow-md shadow-primary/20 cursor-pointer active:scale-95"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Add 4 Standard Slots (10am, 1:30pm, 5pm, 8:30pm)
                    </button>
                </div>

                {/* Quick Time Preset Pills */}
                <div className="mb-4">
                    <p className="text-xs text-gray-300 mb-2 font-medium">Quick Preset Slots for {selectedDate}:</p>
                    <div className="flex flex-wrap gap-2">
                        {standardTimePresets.map(preset => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => addSlot(selectedDate, preset)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/40 bg-black/40 hover:bg-primary/20 text-xs text-white cursor-pointer transition font-medium"
                            >
                                <Plus className="w-3 h-3 text-primary" />
                                <span>{preset}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Time Picker */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-primary/20">
                    <span className="text-xs text-gray-300">Or custom time:</span>
                    <div className="flex items-center gap-2 bg-black/60 border border-primary/40 px-3 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <input
                            type="time"
                            value={customTime}
                            onChange={(e) => setCustomTime(e.target.value)}
                            className="bg-transparent text-white text-xs outline-none cursor-pointer"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => addSlot(selectedDate, customTime)}
                        className="flex items-center gap-1 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg border border-gray-700 transition cursor-pointer"
                    >
                        <Plus className="w-3 h-3 text-primary" />
                        Add Custom Slot
                    </button>
                </div>

                {/* Display Queued Slots */}
                {Object.keys(dateTimeSelection).length > 0 ? (
                    <div className="mt-6 pt-5 border-t border-primary/20">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs uppercase tracking-wider text-primary font-bold">
                                Ready to Publish ({totalQueuedSlots} {totalQueuedSlots === 1 ? 'Showtime' : 'Showtimes'}):
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(dateTimeSelection).map(([date, times]) => (
                                <div key={date} className="p-3 bg-black/50 border border-primary/30 rounded-lg">
                                    <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{date}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {times.map((time) => (
                                            <div key={time} className="bg-primary/20 border border-primary/40 px-2.5 py-1 flex items-center gap-1.5 rounded text-xs text-white">
                                                <span>{time}</span>
                                                <Trash2
                                                    onClick={() => handleRemoveTime(date, time)}
                                                    className="w-3.5 h-3.5 text-red-400 hover:text-red-300 cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-xs mt-4">No showtimes queued yet. Click the preset pills or "Add Custom Slot" above to add timings.</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={addingShow}
                    className="px-10 py-3.5 rounded-full text-sm font-semibold transition-all shadow-xl active:scale-95 flex items-center gap-2 bg-primary hover:bg-primary-dull text-white cursor-pointer shadow-primary/30 scale-105"
                >
                    {addingShow ? 'Publishing Shows...' : `Publish ${totalQueuedSlots > 0 ? totalQueuedSlots + ' Showtimes' : 'Show'} to BookShow`}
                </button>
            </div>
        </div>
    )
}

export default AddShows
