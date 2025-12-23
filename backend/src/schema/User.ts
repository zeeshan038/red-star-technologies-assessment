import Joi from "joi";

export const userSchema = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(120).required().messages({
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must be at most 120 characters long",
            "any.required": "Name is required",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "any.required": "Password is required",
        }),
    });
    return schema.validate(data);
};

export const loginSchemma = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email must be a valid email address",
            "any.required": "Email is required",
        }),
        password: Joi.string().required().messages({
            "any.required": "Password is required",
        }),
    });
    return schema.validate(data);
};