import express from 'express';
import passport from 'passport';
import { isAdmin, isLogged, isUser, redirectIfLoggedIn } from '../middlewares/auth.js';
import { 
    getAdministrationSessionsController,
    getCurrentSessionsController,
    getFailLoginSessionsController,
    getFailRegisterSessionsController,
    getGithubCallbackSessionsController,
    getLoginSessionsController, 
    getLogoutSessionsController, 
    getProfileSessionsController, 
    getRegisterSessionsController, 
    passportLoginSessionsController,
    passportRegisterSessionsController
} from '../controllers/sessions.controllers.js';


const router = express.Router();

router.get('/', redirectIfLoggedIn, getLoginSessionsController)
router.get('/login', redirectIfLoggedIn, getLoginSessionsController);
router.get('/register', redirectIfLoggedIn, getRegisterSessionsController);
router.get('/profile', isLogged, getProfileSessionsController);
router.get('/logout', getLogoutSessionsController);
router.get('/administration', isAdmin, getAdministrationSessionsController);
router.get('/failregister', getFailRegisterSessionsController);
router.get('/faillogin', getFailLoginSessionsController);
router.get('/current', getCurrentSessionsController);

// PASSPORT GITHUB
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), getGithubCallbackSessionsController);

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), passportLoginSessionsController);
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), passportRegisterSessionsController);

export default router;