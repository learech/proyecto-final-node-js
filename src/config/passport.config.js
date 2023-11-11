import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import { UserSchema } from '../models/schemas/users.schema.js';
import GitHubStrategy from 'passport-github2';
import { CartService } from '../services/cart.service.js';
import env from './env.config.js';
import { logger } from '../middlewares/logger.js';

const cartService = new CartService

const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await UserSchema.findOne({ email: username });
        if (!user) {
          logger.warn('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          logger.warn('Invalid Password');
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;
          let user = await UserSchema.findOne({ email: username });
          if (user) {
            logger.warn('User already exists');
            return done(null, false);
          }

          const newCart = await cartService.saveCart();
          const cartId = newCart._id.toString();

          const newUser = {
            email,
            firstName,
            lastName,
            age,
            password: createHash(password),
            cartId,
            role: 'user',
          };
          let userCreated = await UserSchema.create(newUser);
          logger.info(userCreated);
          logger.info('User Registration succesful');
          return done(null, userCreated);
        } catch (e) {
          logger.error('Error in register');
          logger.error(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          const newCart = await cartService.saveCart();
          const cartId = newCart._id.toString();

          let user = await UserSchema.findOne({ email: profile.email });
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              isAdmin: false,
              cartId,
              password: 'nopass',
            };
            let userCreated = await UserSchema.create(newUser);
            logger.info('User Registration succesful');
            return done(null, userCreated);
          } else {
            logger.warn('User already exists');
            return done(null, user);
          }
        } catch (e) {
          logger.error('Error en auth github');
          logger.error(e);
          return done(e);
        }
      }
    )
  );

  // passport.use(twitter)
  // passport.use(facebook)


  //! NO TOCAR... PUEDE ROMPER TODO
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserSchema.findById(id);
    done(null, user);
  });
}
