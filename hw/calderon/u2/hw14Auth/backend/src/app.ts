// src/app.ts
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport'; // Your passport strategy file
import authRoutes from './routes/authRoutes';

const app = express();

app.set('trust proxy', 1); 

const sessionLifetimeSeconds = parseInt(process.env.SESSION_LIFETIME_SECONDS || '60', 10);

app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: sessionLifetimeSeconds * 1000, // 60 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on Render
    sameSite: 'lax'
  }
}));

// Prevent browser caching so copied URLs don't show old data
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

export default app;