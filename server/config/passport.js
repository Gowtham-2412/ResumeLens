import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

const fallbackPort = process.env.PORT || 4000;

const backendBaseUrl = process.env.BACKEND_URL || `http://localhost:${fallbackPort}`;

export const isGoogleOAuthConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (isGoogleOAuthConfigured) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${backendBaseUrl}/api/auth/google/callback`,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value?.toLowerCase();

                    if (!email) {
                        return done(new Error('Google account did not provide an email address.'), null);
                    }

                    let user = await User.findOne({
                        $or: [
                            { googleId: profile.id },
                            { email },
                        ],
                    });

                    if (!user) {
                        user = await User.create({
                            username: profile.displayName || email.split('@')[0],
                            email,
                            googleId: profile.id,
                            provider: 'google',
                        });
                    } else {
                        let hasChanges = false;

                        if (!user.googleId) {
                            user.googleId = profile.id;
                            hasChanges = true;
                        }

                        if (user.provider !== 'google') {
                            user.provider = 'google';
                            hasChanges = true;
                        }

                        if (!user.username && profile.displayName) {
                            user.username = profile.displayName;
                            hasChanges = true;
                        }

                        if (hasChanges) {
                            await user.save();
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.warn('Google OAuth is disabled: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not configured.');
}

export default passport;
