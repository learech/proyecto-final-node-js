import express from "express"
import passport from "passport"
import { goToLogin, isUser } from "../middlewares/auth.middleware.js"
import { sessionGetRegister, sessionPostRegister, sessionGetLogin, sessionPostLogin, sessionGetProfile, sessionGetLogout, sessionGetFailedRegister, getApiSession, sessionGetError } from '../controller/sessions.controller.js'

export const router = new express.Router(); 

router.use(express.json());
router.use(express.urlencoded({extended:true}));
 
router.get('/register', sessionGetRegister);
router.post('/register',passport.authenticate("register-passport", {failureRedirect: "/sessions/failed-register",}),sessionPostRegister);
router.get("/login", sessionGetLogin);
router.post("/login",passport.authenticate("login-passport", {failureRedirect: "/session/register",}),sessionPostLogin);
router.get('/current', isUser, getApiSession);
router.get("/profile",goToLogin, sessionGetProfile);
router.get("/logout", sessionGetLogout);
router.get("/failed-register",sessionGetFailedRegister);
router.get('*', sessionGetError );  