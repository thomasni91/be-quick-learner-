import express from 'express';
import { sendEmailWhenForgotPassword, sendEmailWhenSignup } from '../../controllers/sendEmail';

const router = express.Router();

router.post('/signup', sendEmailWhenSignup);
router.post('/forgot-password', sendEmailWhenForgotPassword);

export default router;
