import { clerkClient } from "@clerk/express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

/**
 * Controller: getUserBookings
 * Retrieves all bookings created by the authenticated Clerk user.
 * Populates the associated show and movie details for display on the "My Bookings" page.
 */
export const getUserBookings = async (req, res)=>{
    try {
        const user = req.auth().userId;

        // If MongoDB connection is not active, return empty list gracefully
        if (mongoose.connection.readyState !== 1) {
            return res.json({success: true, bookings: []});
        }

        // Query bookings for user and populate nested Show and Movie records
        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1 });

        res.json({success: true, bookings});
    } catch (error) {
        console.error("Fetch user bookings error:", error.message);
        res.json({ success: true, bookings: [] });
    }
}

/**
 * Controller: updateFavorite
 * Toggles a movie in the user's private metadata favorites array via Clerk API.
 */
export const updateFavorite = async (req, res)=>{
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = [];
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId);
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata});

        res.json({success: true, message: "Favorite movies updated" });
    } catch (error) {
        console.error("Update favorite error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

/**
 * Controller: getFavorites
 * Retrieves the full list of favorite movies for the authenticated user.
 */
export const getFavorites = async (req, res)=>{
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites || [];

        let movies = [];
        if (mongoose.connection.readyState === 1 && favorites.length > 0) {
            movies = await Movie.find({ _id: { $in: favorites } });
        }

        res.json({ success: true, movies });
    } catch (error) {
        console.error("Get favorites error:", error.message);
        res.json({ success: false, message: error.message, movies: [] });
    }
}
