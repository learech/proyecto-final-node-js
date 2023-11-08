import passport from 'passport'
import { getGithubCallBack } from '../controller/passport.controller.js'
import { Router } from 'express'
export const router = new Router();

router.get('/github', passport.authenticate('auth-github', { scope: [ 'user:email' ] }));
router.get('/github/callback', passport.authenticate('auth-github', { failureRedirect: '/session/register' }),getGithubCallBack); 
