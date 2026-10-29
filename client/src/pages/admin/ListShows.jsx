import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { Trash2, AlertCircle, CheckCircle2, Clock, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY || '₹';
    const { axios, getToken, user, image_base_url } = useAppContext();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [isClearingExpired, setIsClearingExpired] = useState(false);
    const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'expired'
    const [searchQuery, setSearchQuery] = useState('');

    const getAllShows = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/admin/all-shows", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setShows(data.shows || []);
            } else {
                toast.error(data.message || "Failed to load shows");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch shows");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getAllShows();
        }
    }, [user]);

    // Handle single show deletion
    const handleDeleteShow = async (showId, movieTitle) => {
        if (!window.confirm(`Are you sure you want to delete this show for "${movieTitle || 'this movie'}"?`)) {
            return;
        }

        setDeletingId(showId);
        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/admin/show/${showId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Show deleted successfully!");
                setShows(prev => prev.filter(s => s._id !== showId));
            } else {
                toast.error(data.message || "Could not delete show");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete show");
        } finally {
            setDeletingId(null);
        }
    };

    // Handle bulk removal of ended / expired shows
    const handleClearExpiredShows = async () => {
        const expiredCount = shows.filter(s => new Date(s.showDateTime) < new Date()).length;
        if (expiredCount === 0) {
            toast.info("No ended shows to remove!");
            return;
        }

        if (!window.confirm(`Remove all ${expiredCount} past / ended shows from the database?`)) {
            return;
        }

        setIsClearingExpired(true);
        try {
            const token = await getToken();
            const { data } = await axios.delete('/api/admin/clear-expired-shows', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message || `Removed ${expiredCount} ended shows!`);
                setShows(prev => prev.filter(s => new Date(s.showDateTime) >= new Date()));
            } else {
                toast.error(data.message || "Failed to clear expired shows");
            }
        } catch (error) {
            console.error("Clear expired shows error:", error);
            toast.error("Failed to clear expired shows");
        } finally {
            setIsClearingExpired(false);
        }
    };

    const now = new Date();
    const activeShowsCount = shows.filter(s => new Date(s.showDateTime) >= now).length;
    const expiredShowsCount = shows.filter(s => new Date(s.showDateTime) < now).length;

    // Filter shows based on active tab and search query
    const filteredShows = shows.filter(show => {
        const isPast = new Date(show.showDateTime) < now;
        if (filterTab === 'active' && isPast) return false;
        if (filterTab === 'expired' && !isPast) return false;

        if (searchQuery.trim()) {
            const title = (show.movie?.title || '').toLowerCase();
            return title.includes(searchQuery.trim().toLowerCase());
        }
        return true;
    });

    return !loading ? (
        <div className="pb-16 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Title text1="List" text2="Shows" />

                {/* Bulk delete expired button */}
                {expiredShowsCount > 0 && (
                    <button
                        onClick={handleClearExpiredShows}
                        disabled={isClearingExpired}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-medium text-xs md:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                        {isClearingExpired ? 'Removing Ended Shows...' : `Remove ${expiredShowsCount} Ended Show${expiredShowsCount > 1 ? 's' : ''}`}
                    </button>
                )}
            </div>

            {/* Filter Tabs and Search Bar */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-primary/10 p-1 rounded-xl border border-white/5 w-fit">
                    <button
                        onClick={() => setFilterTab('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            filterTab === 'all'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        All Shows ({shows.length})
                    </button>
                    <button
                        onClick={() => setFilterTab('active')}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            filterTab === 'active'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Active ({activeShowsCount})
                    </button>
                    <button
                        onClick={() => setFilterTab('expired')}
                        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            filterTab === 'expired'
                                ? 'bg-red-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Show Over ({expiredShowsCount})
                    </button>
                </div>

                {/* Search input */}
                <div className="relative min-w-56">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search movie title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-primary/10 border border-white/10 rounded-xl text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* Shows Table */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-primary/5 shadow-lg">
                <table className="w-full border-collapse text-left text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-white text-xs uppercase tracking-wider">
                            <th className="py-3 px-4 font-semibold">Movie</th>
                            <th className="py-3 px-4 font-semibold">Show Date & Time</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold">Price</th>
                            <th className="py-3 px-4 font-semibold">Bookings</th>
                            <th className="py-3 px-4 font-semibold">Earnings</th>
                            <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                        {filteredShows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <AlertCircle className="w-8 h-8 text-gray-500" />
                                        <p className="text-sm">No shows found for the selected filter.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredShows.map((show) => {
                                const isExpired = new Date(show.showDateTime) < now;
                                const bookingsCount = show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0;
                                const earnings = bookingsCount * (show.showPrice || 0);
                                const isDeleting = deletingId === show._id;

                                return (
                                    <tr
                                        key={show._id}
                                        className={`hover:bg-white/[0.03] transition-colors ${
                                            isExpired ? 'opacity-70 bg-black/20' : ''
                                        }`}
                                    >
                                        {/* Movie Name & Poster thumbnail */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {show.movie?.poster_path ? (
                                                    <img
                                                        src={image_base_url ? `${image_base_url}${show.movie.poster_path}` : show.movie.poster_path}
                                                        alt={show.movie.title}
                                                        className="w-8 h-12 object-cover rounded shadow-sm border border-white/10"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-8 h-12 bg-primary/20 rounded flex items-center justify-center text-[10px] text-gray-400">
                                                        N/A
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-white max-w-xs truncate">
                                                        {show.movie?.title || "Unknown Title"}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        ID: {show.movie?._id || show.movie || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date and Time */}
                                        <td className="py-3 px-4 text-gray-200">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{dateFormat(show.showDateTime)}</span>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="py-3 px-4">
                                            {isExpired ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                    Show Over
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        {/* Ticket Price */}
                                        <td className="py-3 px-4 text-gray-300 font-medium">
                                            {currency} {show.showPrice}
                                        </td>

                                        {/* Total Bookings */}
                                        <td className="py-3 px-4 text-gray-300">
                                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-xs font-mono">
                                                {bookingsCount} seats
                                            </span>
                                        </td>

                                        {/* Earnings */}
                                        <td className="py-3 px-4 text-emerald-400 font-medium">
                                            {currency} {earnings}
                                        </td>

                                        {/* Delete Action Button */}
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleDeleteShow(show._id, show.movie?.title)}
                                                disabled={isDeleting}
                                                title="Delete this show"
                                                className="inline-flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 transition-all active:scale-95 disabled:opacity-40"
                                            >
                                                {isDeleting ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default ListShows;
