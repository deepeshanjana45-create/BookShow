import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true });
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all shows (active and past/ended shows for management)
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({}).populate('movie').sort({ showDateTime: -1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete a single show by ID
export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedShow = await Show.findByIdAndDelete(id);
        if (!deletedShow) {
            return res.json({ success: false, message: "Show not found" });
        }
        await Booking.deleteMany({ show: id });
        res.json({ success: true, message: "Show deleted successfully" });
    } catch (error) {
        console.error("Delete show error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete all expired / ended shows ("Show Over")
export const clearExpiredShows = async (req, res) => {
    try {
        const now = new Date();
        const expiredShows = await Show.find({ showDateTime: { $lt: now } });
        const ids = expiredShows.map(s => s._id);

        if (ids.length === 0) {
            return res.json({ success: true, message: "No expired shows to remove", count: 0 });
        }

        await Show.deleteMany({ _id: { $in: ids } });
        await Booking.deleteMany({ show: { $in: ids } });

        res.json({ success: true, message: `Successfully removed ${ids.length} ended show(s)`, count: ids.length });
    } catch (error) {
        console.error("Clear expired shows error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
