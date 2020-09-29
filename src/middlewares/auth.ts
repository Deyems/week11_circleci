import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
// import { Request, Response, NextFunction } from 'express';

let envPath = path.resolve(__dirname, '../', '.env');
dotenv.config({ path: envPath });

export function auth(context: any) {
	// console.log(context.headers, 'calling Auth function');
	try {
		const token: any = context.headers['x-auth-token'];
		if (!token) throw Error(JSON.stringify({ message: 'Access denied. No token given!'}));
		const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
		context.user = decoded;
		console.log(decoded);
		
	} catch (e) {
		throw Error(e.message);
		// return ({ mesage: 'Invalid Token' });
	}
}

 