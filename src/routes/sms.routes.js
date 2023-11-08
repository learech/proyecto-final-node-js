import express from 'express'
import { sendSMS } from '../controller/sms.controllers.js'
export const router = new express.Router();


router.get('/', sendSMS)
