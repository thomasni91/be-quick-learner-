import User from '../models/user';

const isUser = async (req, res, next) => {
	const userId = req.user.id;
	try {
		const user = await User.findOne({ _id: userId }).exec();
		if (!user) {
			return res.status(401).json({ message: 'Token invalid' });
		}
		return next();
	} catch (error) {
		return res.status(401).json({ error: error.message });
	}
};

export default isUser;
