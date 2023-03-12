const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(new FacebookStrategy({
    clientID: "976252610201144",
    clientSecret: "b94467fae3d540905203b22259b06168",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user in database
    User.findOne({ facebookId: profile.id }, async (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        user = new User({
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          pictureUrl: profile.photos[0].value
        });
        await user.save();
      }
      return done(null, user);
    });
  }));
  
  // Set up passport sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  