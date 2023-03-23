const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport"); 

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "607985557534-jakbgo8aau3rdivantjud5kji6o77560.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});