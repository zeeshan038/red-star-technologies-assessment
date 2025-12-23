import Joi from "joi";
export const workspaceSchema = (payload) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(120).required().messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must be at most 120 characters long',
            'any.required': 'Name is required'
        }),
    });
    return schema.validate(payload);
};
