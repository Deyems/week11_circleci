import {OrganizationModel,validateOrganization, validateProduct, validateEmployees} from '../models/db/organisation_schema'
import { Document } from 'mongoose';
// import { userSchema, UserModel, validateUser,validateLogin } from '../models/db/user_schema';
// import bcrypt from 'bcrypt';
// import {GraphQLObjectType} from 'graphql';

import bcrypt from 'bcrypt';
import express, { Request, Response, NextFunction } from 'express';
import { UserModel, validateUser, validateLogin } from '../models/db/user_schema';
import { auth } from '../middlewares/auth';

interface OrganizationInputSchema {
    organization_name: string,
    marketValue: number,
    address: string,
    ceo: string,
    country: string,
    products: [string],
    employees: [string]
    createdAt: string,
    updatedAt: string,
}
interface User {
	username: string;
	email: string;
	passkey: string;
}

type argSchema = {
	id: string;
	organizations: OrganizationInputSchema;
	oldProduct: string;
	newProduct: string;
	userDetails: User
};

const errorObject = {
	organization_name: "Product Name doesn't exist ",
	createdAt: "Product Name doesn't exist",
	updatedAt: "Product Name doesn't exist",
	marketValue: null,
	address: "Product Name doesn't exist",
	ceo: "Product Name doesn't exist",
	country: "Product Name doesn't exist",
	products: ["Product Name doesn't exist"],
	employees: ["Product Name doesn't exist"],
};
const notAuthorisedObject = {
	organization_name: "You are not authorized ",
	createdAt: "You are not authorized",
	updatedAt: "You are not authorized",
	marketValue: null,
	address: "You are not authorized",
	ceo: "You are not authorized",
	country: "You are not authorized",
	products: ["You are not authorized"],
	employees: ["You are not authorized"],
};

export const root = {
	oneOrganization: async (args: argSchema, context: any, info: any) => {
        try {
            console.log(context.user, 'in context');       
			let allOrg = await OrganizationModel.findById(args.id);
			if (allOrg) return allOrg;
		} catch (ex) {
			throw Error(ex.message);
			// console.log(ex.message);
		}
	},
	allOrganizations: async (args: argSchema, context: any, info: any) => {
		
		// if (auth(context).hasOwnProperty('message')) return [notAuthorisedObject];
		// }
		// console.log(auth(context), 'here');
		// console.log(auth(context));
		// console.log('got here');
		
		try {
			let allOrg = await OrganizationModel.find({});

			if (allOrg) return allOrg;
		} catch (ex) {
			throw Error(ex.message);
		}
	},
	createOrganization: async (args: argSchema, context: any, info: any) => {
		try {
			args.organizations.createdAt = Date.now().toString();
            const { error, value } = validateOrganization((args.organizations as unknown) as Record<string, unknown>);
            if (error) {
				console.log(error, 'here');
				
                throw new Error(error.details[0].message);
            }
            
			let organization: Document = new OrganizationModel(value);
			return JSON.parse(JSON.stringify(await organization.save()));
		} catch (e) {
			throw Error(e.message);
		}
	}, 
	createUser: async (args: argSchema, context: any, info: any) => {
		try {
			
			const { error, value } = validateUser(args.userDetails as unknown as Record<string, unknown>);
			if (error) {
				throw Error(error.details[0].message);
			}
			let user = await UserModel.findOne({ email: value.email });

			if (user) throw Error('Username and Email already exists');
			
			// //Keep Token
			// const token = user.generateAuthToken();
			// context.headers['x-auth-token'] = token;

			const saltRounds = 10;
			const salt = await bcrypt.genSalt(saltRounds);
			//Hash the password
			value.passkey = await bcrypt.hash(value.passkey, salt);
			
			const newUser = new UserModel(value);
			// await newUser.save();
			return JSON.parse(JSON.stringify(await newUser.save()));
		} catch (e) {
			throw Error(e.message);
		}
	},
	loginUser: async (args: argSchema, context: any, info: any) => {
		try {
			// console.log(args);
			
			const { error, value } = validateLogin((args.userDetails as unknown) as Record<string, unknown>);
			
			console.log(value, 'where my value is');
			if (error) {
				throw Error(error.details[0].message);
			}
			const user: any = await UserModel.findOne({ email: value.email });

			if (!user) throw Error('Invalid Email  and/or Password');

			const validPassword = await bcrypt.compare(value.passkey, user.passkey);

			if (!validPassword) throw Error('Invalid email OR password');
			const token = user.generateAuthToken();
			context.headers['x-auth-token'] = token;
			console.log(context.headers);
			auth(context);
			// context.next();
			// const { next } = context;
			// console.log(next);
			// console.log('seems it got here');
			
				return ({ username: user.username, email: user.email });
		} catch (e) {
			throw Error(e.message);
		}
	},

	updateOrganization: async (args: argSchema, context: any, info: any) => {
		try {
			const { id, ...others } = args;
			others.organizations.updatedAt = Date.now().toString();
			const {error, value} = validateOrganization((others.organizations as unknown) as Record<string, unknown>);
			if(error) throw Error(error.details[0].message);

			let organization: Document| null = await OrganizationModel.findOneAndUpdate({_id: id}, value, {new: true});
			// console.log(organization,'From the APP');
			
			if (organization === null) {
				// organization = value as Document;
				// console.log(organization, 'After UPdating');
				throw new Error(JSON.stringify({message: 'no doc found'}));
			}
			return await organization.save();
		} catch (ex) {
			throw Error(ex.message);
		}
    },
    
    //NOt Confirmed YET
	updateProduct: async (args: argSchema, context: any, info: any) => {
		try {
			const { id,oldProduct, newProduct } = args;
			const { error, value } = validateProduct({
				newProduct
            });
            if (error) throw new Error(error.details[0].message);
            const foundOrganization: any = await OrganizationModel.find({ _id: id });
            
			if (foundOrganization) {
                if (!foundOrganization[0].products.includes(oldProduct)) {
                    return errorObject;
                }
                foundOrganization[0].updatedAt = Date.now().toString();
				const newUpdate = foundOrganization[0].products.map((item: any) => {
					if (item == oldProduct) return value.newProduct;
					return item;
				});
				foundOrganization[0].products = newUpdate;
				return await foundOrganization[0].save();
			}
		} catch (ex) {
			throw Error(ex.message);
		}
	},

	updateEmployee: async (args: any, context: any, info: any) => {
		try {
			const { id,oldEmployee, newEmployee } = args;
			const { error, value } = validateEmployees({
				newEmployee
			});
			if (error) throw new Error(error.details[0].message);

			const foundCompany: any = await OrganizationModel.find({ _id: id });
            // console.log(foundCompany);
            
            if (foundCompany) {
                if (!foundCompany[0].employees.includes(oldEmployee)) {
					return errorObject;
				}
                foundCompany[0].updatedAt = Date.now().toString();
				const newUpdate = foundCompany[0].employees.map((item: any) => {
					if (item == oldEmployee) return value.newEmployee;
					return item;
				});
				foundCompany[0].employees = newUpdate;
				return await foundCompany[0].save();
			}
		} catch (ex) {
			throw Error(ex.message);
		}
	},
	deleteById: async (args: argSchema, context: any, info: any) => {
		try {
			const toBeDeleted = await OrganizationModel.findOneAndDelete(
				{
					_id: args.id,
				},
				{ rawResult: true }
			);
			if (!toBeDeleted) return { message: 'No organization found' };
			return toBeDeleted.value;
		} catch (ex) {
			throw Error(ex.message);
		}
	},
};