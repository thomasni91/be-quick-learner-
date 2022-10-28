import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).json({ message: 'Token Not Found' });
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		req.decoded = decoded;
		req.user = req.decoded;
		return next();
	} catch (error) {
		return res.status(401).json({ error: error.message });
	}
};
export default authMiddleware;
