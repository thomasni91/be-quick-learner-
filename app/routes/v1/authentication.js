import express from 'express';
import { signIn, signUp, getUser, googleAuth, signupEmailVerified } from '../../controllers/authentication';
import { signInValidate, signUpValidate } from '../../validation/authentication';
import { validation } from '../../validation/common';
import authMiddlewares from '../../middleware/authMiddlewares';

const router = express.Router();
router.post('/signup-verify', authMiddlewares, signupEmailVerified);
router.post('/signin', signInValidate, validation, signIn);
router.post('/signup', signUpValidate, validation, signUp);
router.post('/google-auth', googleAuth);
router.get('/me', authMiddlewares, getUser);

export default router;
