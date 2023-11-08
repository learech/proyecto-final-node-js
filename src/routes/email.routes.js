import { Router } from 'express'
import cookieParser from 'cookie-parser'
export const router = new Router();
import { sendEmail, sendMailWhitAttachments, sendResetPass, forgotPass, resetForm, resetPass } from '../controller/mail.controller.js'

router.use(cookieParser())
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.get('/', sendEmail);
router.get('/attachments', sendMailWhitAttachments);
 
router.get('/forgot-password', forgotPass);
router.post('/reset-info',sendResetPass );
router.get('/reset-form/', resetForm); 
router.post('/reset-password', resetPass); 