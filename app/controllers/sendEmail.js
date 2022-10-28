import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import User from '../models/user';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let URL = null;
if (process.env.NODE_ENV === 'development') {
	URL = process.env.DEVELOPMENT_URL;
} else {
	URL = process.env.PRODUCTION_URL;
}

const SES_CONFIG = {
	accessKeyId: process.env.SES_IAM_USER_ACCESS_KEY,
	secretAccessKey: process.env.SES_IAM_USER_SECRET_ACCESS_KEY,
	region: 'ap-southeast-2',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

export const sendEmailWhenSignup = async (req, res) => {
	const { recipientEmail } = req.body;
	const email = recipientEmail;
	const user = await User.findOne({ email }).exec();
	if (!user) {
		return res.status(404).json(`Can not find user with email ${email}`);
	}
	const id = user._id.toString();
	const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
	const params = {
		Source: process.env.SENDER_EMAIL_ADDRESS,
		Destination: {
			ToAddresses: [recipientEmail],
		},
		ReplyToAddresses: [],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<html>
          <body>
          <p>Dear Quick Learner Customer,<br><br></p>
          <p>We're happy you signed up for Quick Learner. 
          To start exploring the Quick Learner App, 
          please confirm your email address.
          <br><br>
          Click below to confirm your email address:</p>
          <a href='${URL}/email-verified/${token}'>${URL}/email-verfied/${token}</a>
          <p>Your request will not be processed unless you confirm the address using this URL. 
          This link expires 24 hours after your original verification request. 
          If you have problems, please paste the above URL into your web browser.
          <br>
          </p>
          <p>
          If you did NOT request to verify this email address, 
          do not click on the link. Please note that many times, 
          the situation isn't a phishing attempt, 
          but either a misunderstanding of how to use our service, 
          or someone setting up email-sending capabilities on your behalf as part of a legitimate service, 
          but without having fully communicated the procedure first.
          </p>
          <br><br><br><br><br>
          <p>Sincerely,</p>
          <p>The Quick Learner Team</p>
          </body>
          </html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Quick Learner - Email Address Verification Request`,
			},
		},
	};
	try {
		await AWS_SES.sendEmail(params).promise();
		return res.status(200).json({ message: 'Email send successfully' });
	} catch (error) {
		return res.status(404).json({ message: 'Failed to send', error });
	}
};

export const sendEmailWhenForgotPassword = async (req, res) => {
	const { recipientEmail } = req.body;
	const email = recipientEmail;
	const user = await User.findOne({ email }).exec();
	if (!user) {
		return res.status(404).json({ message: 'Email not found, please check it again.' });
	}
	const id = user._id.toString();
	const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
	const params = {
		Source: process.env.SENDER_EMAIL_ADDRESS,
		Destination: {
			ToAddresses: [recipientEmail],
		},
		ReplyToAddresses: [],
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `<html>
          <body>
          <p>Dear Quick Learner Customer,<br><br></p>
          <p>Forgot your password?
          <br>
          We received a request to reset the password for your account.
          <br><br><br>
          To reset your password, click on the button below:</p>
          <button style="background:#506bee;padding:5px;border-radius:10px;cursor:pointer;border:1px solid #506bee">
          <a 
          style="text-decoration:none;color:white;font-size:20px;"
          href="${URL}/signin/reset-password/${token}">
          Reset password
          </a>
          </button>
          <br><br><br>
          <p> 
          This link expires 24 hours after your original verification request. 
          If you have problems, please paste the below URL into your web browser.
          <br>
          <a href="${URL}/signin/reset-password/${token}">${URL}/signin/reset-password/${token}</a>
          </p>
          <br><br><br>
          <p>
          If you did NOT request to reset password with this email address, 
          do not click on the link. Please note that many times, 
          the situation isn't a phishing attempt, 
          but either a misunderstanding of how to use our service, 
          or someone setting up email-sending capabilities on your behalf as part of a legitimate service, 
          but without having fully communicated the procedure first.
          </p>
          <br><br><br><br><br>
          <p>Sincerely,</p>
          <p>The Quick Learner Team</p>
          </body>
          </html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Quick Learner - Reset password`,
			},
		},
	};
	try {
		await AWS_SES.sendEmail(params).promise();
		return res.status(200).json({ message: 'Email send successfully' });
	} catch (error) {
		return res.status(404).json({ message: 'Failed to send', error });
	}
};
