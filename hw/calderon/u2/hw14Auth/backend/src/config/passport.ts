// src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_REDIRECT_URI!
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists in Supabase, if not, create them
      let user = await prisma.user.findUnique({
        where: { email: profile.emails?.[0].value }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            google_id: profile.id,
            email: profile.emails![0].value,
            name: profile.displayName,
            profile_image: profile.photos?.[0].value
          }
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});