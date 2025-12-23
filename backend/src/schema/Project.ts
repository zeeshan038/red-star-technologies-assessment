import Joi from "joi";


export const projectSchema = (payload: any) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Name is required",
            "string.empty": "Name cannot be empty"
        }),
        description: Joi.string().required().messages({
            "any.required": "Description is required",
            "string.empty": "Description cannot be empty"
        }),
    });
    return schema.validate(payload);
};