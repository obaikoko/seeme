import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../model/userModel.js';

const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user);
          } else {
            await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              password: 'password',
            });
            return done(null, profile);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    return done(err);
  }
});


};

export default configureGoogleStrategy;
