import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Writer from '../models/Writer';
import bcrypt from 'bcryptjs';

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // Use email as the username
    async (email, password, done) => {
      try {
        const writer = await Writer.findOne({ email });
        if (!writer) {
            return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, writer.password);
        
        if (!isMatch) {
            return done(null, false, { message: 'Invalid password' });
        }

        return done(null, writer);

      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user ID into session
passport.serializeUser((writer, done) => {
  done(null, writer._id);
});

// Deserialize user from session
passport.deserializeUser(async (_id, done) => {
  try {
    const writer = await Writer.findById(id);
    done(null, writer);
  } catch (error) {
    done(error);
  }
});

export default passport;
