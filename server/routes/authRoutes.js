import express from 'express';
import passport, { isGoogleOAuthConfigured } from '../config/passport.js'
import { googleAuth, loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

const ensureGoogleOAuthConfigured = (_req, res, next) => {
    if (!isGoogleOAuthConfigured) {
        return res.status(503).json({
            message: 'Google OAuth is not configured on the server. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL, and BACKEND_URL to server/.env.',
        });
    }

    return next();
};

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/google/status', (_req, res) => {
    res.json({
        configured: isGoogleOAuthConfigured,
        message: isGoogleOAuthConfigured
            ? 'Google OAuth is configured.'
            : 'Google OAuth is not configured on the server. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL, and BACKEND_URL to server/.env.',
    });
})

router.get('/google', ensureGoogleOAuthConfigured, passport.authenticate("google", {scope: ["profile", "email"] }))
router.get('/google/callback', ensureGoogleOAuthConfigured, passport.authenticate("google", { session: false }), googleAuth)

export default router
