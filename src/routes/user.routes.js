import express from 'express'
import passport from 'passport'
import { goToLogin, isAdmin } from "../middlewares/auth.middleware.js"
import { getUser, getUserById, rolUserById, postUser, delUserById, delUsers, putUserById, userDocuments, deleteDocuments } from '../controller/users.controller.js'
import { usersUploader } from '../utils/multer.js'

export const router = new express.Router();
router.use(express.json()); 
router.use(express.urlencoded({extended:true}));
     
router.get('/',goToLogin, isAdmin, getUser); 
router.get('/:uid',goToLogin, isAdmin, getUserById);
router.post('/', passport.authenticate('register-passport',{failureRedirect:'/session/failed-register'}),postUser);
router.delete('/:uid',goToLogin, isAdmin, delUserById);
router.delete('/',goToLogin, isAdmin, delUsers);
router.put('/:uid',goToLogin, isAdmin, putUserById); 
router.put('/premium/:uid',rolUserById );
router.post('/:uid/documents',goToLogin, usersUploader(), userDocuments); 
router.delete('/:uid/documents',goToLogin, deleteDocuments);   