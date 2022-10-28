import express from 'express';
import { changePassword, changeUsername, deleteUser, resetPassword } from '../../controllers/user';
import { userChangePasswordValidation, userChangeUsernameValidation, userValidation } from '../../validation/user';

const router = express.Router();

router.post('/changepassword', userChangePasswordValidation, userValidation, changePassword);
router.post('/changeusername', userChangeUsernameValidation, userValidation, changeUsername);
router.post('/resetpassword', userValidation, resetPassword);

/**
 *@route   DELETE api/v1/users/
 *@desc    Delete user by id
 *@access  Private
 */
router.delete('/', deleteUser);

export default router;
