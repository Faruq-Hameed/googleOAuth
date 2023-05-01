const passport = require("passport");
const User = require("../db/model/user");
const {
  addGoogleUser,
  getUsers,
  getUserByEmail,
} = require("../controllers/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.CALLBACK_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    /**the profile will contain the user information gotten from the google */
    async (accessToken, refreshToken, profile, done) => {
      console.log({profile})
      const id = profile.id;
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const profilePhoto = profile.photos[0].value;
      const source = "google";

      /**we create the user if the email is already in the database*/
      const currentUser = await getUserByEmail({
        email,
      });

      if (!currentUser) {
        const newUser = await addGoogleUser({
          id,
          email,
          firstName,
          lastName,
          profilePhoto,
        });
        return done(null, newUser);
      }

      if (currentUser.source != "google") {
        //if the user signed up with other source but same email
        //return error
        return done(null, false, {
          message: `You have previously signed up with a different signing method`,
        });
      }

      currentUser.lastVisited = new Date(); //if not i.e if he signed up with google, we just updated the last visited date
      return done(null, currentUser);
    }
  ) 
); 
