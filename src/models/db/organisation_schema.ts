import mongoose from 'mongoose';
import Joi from 'joi';
const organizationSchema = new mongoose.Schema({
    organization_name: {
        type: String,
        minlength: 7,
        maxlength: 50,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    marketValue: {
        type: Number,
        min: 1,
        max: 100,
        required: true,
    },
    address: {
        type: String,
        minlength: 10,
        maxlength: 200,
        required: true,
    },
    ceo: { 
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    products: [{
        type: String,
        required: true,
    }],
    employees: [{
        type: String,
        required: true,
    }]
});

export const OrganizationModel = mongoose.model('organization', organizationSchema);

export function validateOrganization(details: Record<string, unknown>) {
    const schema = Joi.object({
        organization_name: Joi.string().min(7).max(50).required().trim(),
        createdAt: Joi.date(),
        updatedAt: Joi.date().default(Date.now),
        marketValue: Joi.number().min(1).max(100).required(),
        address: Joi.string().min(10).max(200).required(),
        ceo: Joi.string().min(2).max(20).required(),
        country: Joi.string().required(),
        products: Joi.array().items(Joi.string()).required(),
        employees: Joi.array().items(Joi.string()).required(),
    });
    return schema.validate(details, {
        abortEarly: false
    });
}

export function validateProduct(details: Record<string, string>) {
    const schema = Joi.object({
        newProduct: Joi.string().min(3).max(40).required().trim()
    });
    return schema.validate(details, {
        abortEarly: false
    });
}
export function validateEmployees(details: Record<string, string>) {
    const schema = Joi.object({
        newEmployee: Joi.string().min(3).max(40).required().trim()
    });
    return schema.validate(details, {
        abortEarly: false
    });
}