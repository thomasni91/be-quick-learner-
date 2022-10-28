import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *         - email
 *           password
 *      properties:
 *        _id:
 *          type: string
 *          description: auto generated unique identifier by mongoDB
 *        name:
 *          type: string
 *          description: name of the user
 *        email:
 *          type: string
 *          description: user email
 *        password:
 *          type: string
 *          description: user passowrd
 *      examples:
 *          id: "61fa13cc56724fc5edc7872e"
 *          name: "Jane"
 *          email: "quickLearner@gmail.com"
 *          password: "hiPassword"
 */
const SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: false, default: 'BrainCell' },
		password: { type: String, required: true },
		email: { type: String, required: true, index: { unique: true } },
		verified: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

userSchema.pre('save', async function saveUser(next) {
	const user = this;
	// only hash the password if it has been modified
	if (!user.isModified('password')) return next();
	// hash the password along with salt
	user.password = await bcrypt.hashSync(user.password, SALT_WORK_FACTOR);
	return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
