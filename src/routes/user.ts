import bcrypt from 'bcrypt';
import express, { Request, Response, NextFunction } from 'express';
import {UserModel, validateUser, validateLogin} from '../models/db/user_schema';

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
		const { error, value } = validateUser(req.body);
		if (error) {
			throw Error(error.details[0].message);
		}
		let user = await UserModel.findOne({ email: value.email });
		
		if (user) throw Error('Username and Email already exists');
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		//Hash the password
        value.passkey = await bcrypt.hash(value.passkey, salt);
		const newUser = new UserModel(value);
		await newUser.save();

		return res.status(200).json({message: `${value.email} Details successfully registered`, });
	} catch (e) {
		return res.status(400).send(e.message);
	}
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = validateLogin(req.body);
        console.log(value);
        
		if (error) {
			return res.status(404).send(error.details[0].message);
		}
		const user: any = await UserModel.findOne({ email: value.email });

		if (!user) throw Error('Invalid Email  and/or Password');

		const validPassword = await bcrypt.compare(value.passkey, user.passkey);

		if (!validPassword) throw Error('Invalid email OR password');
		const token = user.generateAuthToken();
		res.header('x-auth-token', token).status(200).json({ username: user.username, email: user.email });
	} catch (e) {
		return res.status(400).send(e.message);
	}
});

export default router; 