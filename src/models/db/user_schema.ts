//MODULE/PACKAGE IMPORTS
import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import  dotenv from 'dotenv';
import path from 'path';

//FILE IMPORTS

let envPath = path.resolve(__dirname, '../', '.env');
dotenv.config({ path: envPath });

export const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minlength: 3,
		maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        unique: true,
    },
    passkey: {
        type: String,
		minlength: 3,
		maxlength: 255,
		required: true,
    }
});
 
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, }, process.env.SECRET_KEY as string);
    // console.log(token);
    return token;
}

export const UserModel = mongoose.model('user', userSchema);

export function validateUser(details: Record<string,unknown>){
    const schema = Joi.object({
        username: Joi.string().min(3)
            .required(),
        email: Joi.string().min(3)
            .required()
            .email(),
        passkey: Joi.string()
        .required(),
    });
    return schema.validate(details,{
        abortEarly: false
    });
}

export function validateLogin(details: Record<string,unknown>){
    const schema = Joi.object({
        email: Joi.string().min(3)
            .required()
            .email(),
        passkey: Joi.string()
        .required(),
    });
    return schema.validate(details,{
        abortEarly: false
    });
}
