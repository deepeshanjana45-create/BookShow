import axios from "axios"
import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// Helper to construct TMDB API request headers and query parameters
const getTmdbConfig = (extraParams = {}) => {
    const key = process.env.TMDB_API_KEY?.trim();
    if (key?.startsWith('eyJ')) {
        return {
            headers: { Authorization: `Bearer ${key}` },
            params: { ...extraParams }
        };
    }
    return {
        params: {
            api_key: key,
            ...extraParams
        }
    };
};

// TMDB Genre ID to Name Mapping
const tmdbGenreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

// Permitted languages: Strictly English and Hindi only
const ALLOWED_LANGUAGES = ['en', 'hi'];

const FALLBACK_NOW_PLAYING = [
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

/**
 * Controller: getNowPlayingMovies
 * Fetches current theatrical releases.
 * Strictly filters by actual language metadata (only 'en' and 'hi').
 * Always includes curated Hindi & English titles.
 */
export const getNowPlayingMovies = async (req, res) => {
    try {
        const seen = new Set();
        const filteredMovies = [];

        // 1. Add curated movies first
        for (const m of FALLBACK_NOW_PLAYING) {
            seen.add(String(m.id));
            filteredMovies.push(m);
        }

        // 2. Try fetching from TMDB if online
        try {
            const pages = [1, 2];
            const promises = pages.map(page =>
                axios.get('https://api.themoviedb.org/3/movie/now_playing', getTmdbConfig({ region: 'IN', page }))
            );

            const responses = await Promise.allSettled(promises);
            for (const resp of responses) {
                if (resp.status === 'fulfilled' && resp.value?.data?.results) {
                    for (const m of resp.value.data.results) {
                        const lang = m.original_language?.toLowerCase();
                        if (m && lang && ALLOWED_LANGUAGES.includes(lang) && !seen.has(String(m.id)) && m.poster_path) {
                            seen.add(String(m.id));
                            filteredMovies.push({
                                id: String(m.id),
                                title: m.title,
                                poster_path: m.poster_path,
                                backdrop_path: m.backdrop_path || m.poster_path,
                                release_date: m.release_date,
                                original_language: lang,
                                vote_average: m.vote_average,
                                vote_count: m.vote_count,
                                overview: m.overview
                            });
                        }
                    }
                }
            }
        } catch (tmdbErr) {
            console.log("TMDB now playing notice:", tmdbErr.message);
        }

        res.json({ success: true, movies: filteredMovies });
    } catch (error) {
        console.error("Fetch now playing movies error:", error.message);
        res.json({ success: true, movies: FALLBACK_NOW_PLAYING });
    }
}

/**
 * Controller: addShow (Admin)
 * Creates a new show with configured date/times and seating in MongoDB.
 */
export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice, movieData } = req.body;

        if (!movieId || !showsInput || !showsInput.length || !showPrice) {
            return res.json({ success: false, message: "Missing required fields (Movie, Timings, or Price)" });
        }

        let movie = null;
        if (mongoose.connection.readyState === 1) {
            movie = await Movie.findById(String(movieId));
        }

        if (!movie) {
            let movieDetails = null;

            // Try TMDB API
            try {
                const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, getTmdbConfig()),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, getTmdbConfig())
                ]);

                const d = movieDetailsResponse.data;
                const c = movieCreditsResponse.data;
                const lang = d.original_language?.toLowerCase() || 'hi';

                movieDetails = {
                    _id: String(movieId),
                    title: d.title || "Cinema Movie",
                    overview: d.overview || "Now showing in theatres",
                    poster_path: d.poster_path || "",
                    backdrop_path: d.backdrop_path || d.poster_path || "",
                    genres: d.genres || [{ id: 28, name: "Action" }],
                    casts: (c.cast || []).slice(0, 12),
                    release_date: d.release_date || new Date().toISOString().split('T')[0],
                    original_language: lang,
                    tagline: d.tagline || "",
                    vote_average: d.vote_average || 7.5,
                    runtime: d.runtime || 140,
                };
            } catch (tmdbErr) {
                console.log("TMDB fetch notice during addShow:", tmdbErr.message);
            }

            // Fallback from client movieData or fallback catalog
            if (!movieDetails) {
                const fb = FALLBACK_NOW_PLAYING.find(f => String(f.id) === String(movieId)) || movieData || {};
                movieDetails = {
                    _id: String(movieId),
                    title: fb.title || "Cinema Movie",
                    overview: fb.overview || "Exciting theatrical experience",
                    poster_path: fb.poster_path || "",
                    backdrop_path: fb.backdrop_path || fb.poster_path || "",
                    genres: fb.genres || [{ id: 28, name: "Action" }],
                    casts: fb.casts || [{ name: "Lead Star", profile_path: "/profile.png" }],
                    release_date: fb.release_date || new Date().toISOString().split('T')[0],
                    original_language: fb.original_language || "hi",
                    tagline: fb.tagline || "Experience cinema like never before",
                    vote_average: fb.vote_average || 7.5,
                    runtime: fb.runtime || 140
                };
            }

            if (mongoose.connection.readyState === 1) {
                try {
                    movie = await Movie.create(movieDetails);
                } catch (createErr) {
                    movie = await Movie.findById(String(movieId));
                }
            } else {
                movie = movieDetails;
            }
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            const times = Array.isArray(show.time) ? show.time : [show.time];
            times.forEach(time => {
                const dateTimeString = `${showDate}T${time}:00`;
                showsToCreate.push({
                    movie: String(movieId),
                    showDateTime: new Date(dateTimeString),
                    showPrice: Number(showPrice),
                    occupiedSeats: {}
                });
            });
        });

        if (showsToCreate.length > 0 && mongoose.connection.readyState === 1) {
            await Show.insertMany(showsToCreate);
        }

        try {
            await inngest.send({
                name: "app/show.added",
                data: { movieTitle: movie?.title || "Movie" }
            });
        } catch (e) {}

        return res.json({ success: true, message: 'Show Added successfully!' });
    } catch (error) {
        console.error("Add show error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

/**
 * Controller: getShows
 * Returns ONLY movies that have actual configured Show documents in MongoDB.
 * No random TMDB browsing - admin controls what shows are available via admin panel.
 * Strictly filtered to English (en) and Hindi (hi) only.
 */
export const getShows = async (req, res) => {
    try {
        // Only return shows that are actually configured in MongoDB
        if (mongoose.connection.readyState === 1) {
            const todayMidnight = new Date();
            todayMidnight.setHours(0, 0, 0, 0);
            const shows = await Show.find({ showDateTime: { $gte: todayMidnight } })
                .populate('movie')
                .sort({ showDateTime: 1 });

            // Get unique movies that have at least one upcoming show
            const seenIds = new Set();
            const movies = [];
            for (const show of shows) {
                if (!show.movie) continue;
                const lang = show.movie.original_language?.toLowerCase();
                // Strictly English or Hindi only
                if (!lang || !ALLOWED_LANGUAGES.includes(lang)) continue;
                const key = String(show.movie._id);
                if (!seenIds.has(key)) {
                    seenIds.add(key);
                    movies.push(show.movie);
                }
            }

            // Always merge in the curated dummy shows so they stay available alongside admin-added shows
            for (const m of FALLBACK_NOW_PLAYING) {
                const mid = String(m.id || m._id);
                if (!seenIds.has(mid)) {
                    seenIds.add(mid);
                    movies.push({
                        ...m,
                        _id: mid,
                        id: mid
                    });
                }
            }

            return res.json({ success: true, shows: movies });
        }

        // If DB is not connected, return empty — client will use dummyShowsData fallback
        return res.json({ success: false, shows: [] });

    } catch (error) {
        console.error("Get shows error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Configured movie IDs that always have showtimes available (managed via dummyShowsData on client)
const CONFIGURED_MOVIE_IDS = ['1269325', '552524', '1375156', '668489', '1654581', '324544', '1232546', '1772549'];

// Generate upcoming showtime slots for the next 4 days (matches client dummyDateTimeData)
const generateUpcomingDateTimes = (movieId) => {
    const dateTime = {};
    const today = new Date();
    for (let i = 0; i < 4; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dateTime[dateStr] = [
            { time: `${dateStr}T10:00:00.000Z`, showId: `show_${dateStr}_${movieId}_1` },
            { time: `${dateStr}T13:30:00.000Z`, showId: `show_${dateStr}_${movieId}_2` },
            { time: `${dateStr}T17:00:00.000Z`, showId: `show_${dateStr}_${movieId}_3` },
            { time: `${dateStr}T20:30:00.000Z`, showId: `show_${dateStr}_${movieId}_4` }
        ];
    }
    return dateTime;
};

/**
 * Controller: getShow
 * Retrieves details for a specific movie:
 * 1. Checks MongoDB for active showtimes.
 * 2. If movie is a configured show but has no DB showtimes, injects generated upcoming slots.
 * 3. If not in DB, fetches movie details and cast credits directly from TMDB API.
 * 4. Enforces English & Hindi language constraint.
 */
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;

        let movie = null;
        let shows = [];

        if (mongoose.connection.readyState === 1) {
            const todayMidnight = new Date();
            todayMidnight.setHours(0, 0, 0, 0);
            shows = await Show.find({movie: movieId, showDateTime: { $gte: todayMidnight }});
            movie = await Movie.findById(movieId);
        }

        // If not in database, fetch details and credits dynamically from TMDB API
        if (!movie) {
            try {
                const [detailsResp, creditsResp] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, getTmdbConfig()),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, getTmdbConfig())
                ]);

                const d = detailsResp.data;
                const c = creditsResp.data;
                const lang = d.original_language?.toLowerCase();

                // Enforce that only English and Hindi movies can be retrieved
                if (lang && ALLOWED_LANGUAGES.includes(lang)) {
                    movie = {
                        _id: String(d.id),
                        id: d.id,
                        title: d.title,
                        overview: d.overview,
                        poster_path: d.poster_path,
                        backdrop_path: d.backdrop_path,
                        genres: d.genres || [],
                        casts: (c.cast || []).slice(0, 12).map(act => ({
                            name: act.name,
                            profile_path: act.profile_path
                        })),
                        release_date: d.release_date,
                        original_language: lang,
                        tagline: d.tagline || "",
                        vote_average: d.vote_average,
                        runtime: d.runtime || 140
                    };
                }
            } catch (err) {
                console.error("TMDB fetch notice for movie " + movieId + ":", err.message);
            }
        }

        // If still not found from DB or TMDB, check fallback catalog
        if (!movie) {
            const fb = FALLBACK_NOW_PLAYING.find(f => String(f.id) === String(movieId) || String(f._id) === String(movieId));
            if (fb) {
                movie = {
                    _id: String(fb.id || fb._id),
                    id: String(fb.id || fb._id),
                    title: fb.title,
                    overview: fb.overview,
                    poster_path: fb.poster_path,
                    backdrop_path: fb.backdrop_path,
                    genres: fb.genres || [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }],
                    casts: fb.casts || [],
                    release_date: fb.release_date,
                    original_language: fb.original_language || "hi",
                    tagline: fb.tagline || "",
                    vote_average: fb.vote_average || 7.0,
                    runtime: fb.runtime || 135
                };
            }
        }

        const dateTime = {};

        if (shows.length > 0) {
            // Build dateTime directly from real MongoDB show records added by admin
            shows.forEach((show) => {
                const d = new Date(show.showDateTime);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const dateKey = `${year}-${month}-${day}`;

                if (!dateTime[dateKey]) dateTime[dateKey] = [];
                dateTime[dateKey].push({
                    time: show.showDateTime,
                    showId: show._id,
                    showPrice: show.showPrice || 250
                });
            });
        } else if (CONFIGURED_MOVIE_IDS.includes(String(movieId))) {
            // Only if NO shows exist in DB yet, provide generated demo slots
            const generated = generateUpcomingDateTimes(movieId);
            Object.assign(dateTime, generated);
        }

        // Sort all showtimes chronologically for each date
        Object.keys(dateTime).forEach(d => {
            dateTime[d].sort((a, b) => new Date(a.time) - new Date(b.time));
        });

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error("Get show details error:", error.message);
        res.json({ success: false, message: error.message });
    }
}
