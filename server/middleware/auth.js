import { clerkClient } from "@clerk/express";

const DEFAULT_ADMIN_EMAILS = [
    'deepeshanjana9@gmail.com',
    'deepeshanjana45@gmail.com',
    'deepeshanjana61@gmail.com'
];

export const protectAdmin = async (req, res, next) => {
    try {
        let userId = null;
        try {
            userId = typeof req.auth === 'function' ? req.auth()?.userId : req.auth?.userId;
        } catch (e) {
            userId = null;
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const user = await clerkClient.users.getUser(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Check if role is admin in private metadata
        const hasAdminRole = user.privateMetadata?.role === 'admin';

        // Check configured admin emails (from env or defaults)
        const envEmails = (process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase());
        const senderEmails = (process.env.SENDER_EMAIL || '').split(',').map(e => e.trim().toLowerCase());
        const adminEmails = new Set([
            ...DEFAULT_ADMIN_EMAILS.map(e => e.toLowerCase()),
            ...envEmails,
            ...senderEmails
        ].filter(Boolean));

        const userEmails = (user.emailAddresses || []).map(e => e.emailAddress?.toLowerCase().trim());
        const isEmailAdmin = userEmails.some(email => adminEmails.has(email));

        if (hasAdminRole || isEmailAdmin) {
            // Ensure role is stored in Clerk privateMetadata
            if (!hasAdminRole) {
                try {
                    await clerkClient.users.updateUserMetadata(userId, {
                        privateMetadata: { ...user.privateMetadata, role: 'admin' }
                    });
                } catch (metaErr) {
                    console.log("Clerk metadata update notice:", metaErr.message);
                }
            }
            return next();
        }

        // User is authenticated, but NOT an admin
        return res.status(403).json({ success: false, message: "You are not authorized to access admin dashboard" });
    } catch (error) {
        console.error("protectAdmin error:", error);
        return res.status(403).json({ success: false, message: "Access denied: Not authorized as admin" });
    }
};
