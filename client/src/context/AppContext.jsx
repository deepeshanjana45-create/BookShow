import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { dummyShowsData } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const KNOWN_ADMIN_EMAILS = [
    'deepeshanjana9@gmail.com',
    'deepeshanjana45@gmail.com',
    'deepeshanjana61@gmail.com'
];

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Default to false so regular users never see admin controls
    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState(dummyShowsData);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken();
            if (token) {
                const { data } = await axios.get('/api/admin/is-admin', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data && data.success && data.isAdmin) {
                    setIsAdmin(true);
                    return true;
                }
            }
            // Check known admin email as fallback
            const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            if (email && KNOWN_ADMIN_EMAILS.includes(email)) {
                setIsAdmin(true);
                return true;
            }
            setIsAdmin(false);
            return false;
        } catch (error) {
            const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            if (email && KNOWN_ADMIN_EMAILS.includes(email)) {
                setIsAdmin(true);
                return true;
            }
            setIsAdmin(false);
            return false;
        }
    };

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all');
            if (data.success && data.shows && data.shows.length > 0) {
                setShows(data.shows);
            } else {
                setShows(dummyShowsData);
            }
        } catch (error) {
            setShows(dummyShowsData);
        }
    };

    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setFavoriteMovies(data.movies);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    useEffect(() => {
        if (user) {
            const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
            if (email && KNOWN_ADMIN_EMAILS.includes(email)) {
                setIsAdmin(true);
            }
            fetchIsAdmin();
            fetchFavoriteMovies();
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    const value = {
        axios,
        fetchIsAdmin,
        user,
        getToken,
        navigate,
        isAdmin,
        shows,
        favoriteMovies,
        fetchFavoriteMovies,
        image_base_url
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
