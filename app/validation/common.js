import { validationResult, param } from 'express-validator';

export function validation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array().map((_) => {
				if (_.param === 'password') {
					return {
						msg: 'Invalid value',
						param: 'password',
						location: 'body',
					};
				}
				return _;
			}),
		});
	}
	return next();
}

export const idValidation = [
	param('id', 'Id not valid')
		.isLength({ min: 24, max: 24 })
		.matches(/^[0-9A-Fa-f]*$/),
];
