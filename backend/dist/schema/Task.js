import Joi from "joi";
export const taskSchema = (payload) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            "any.required": "Title is required",
            "string.empty": "Title cannot be empty"
        }),
        description: Joi.string().optional().allow(null, ""),
        status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE").required().messages({
            "any.required": "Status is required",
            "any.only": "Status must be one of TODO, IN_PROGRESS, DONE"
        }),
        priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
        due_date: Joi.date().optional().allow(null),
        assigned_to: Joi.number().required().allow(null),
    });
    return schema.validate(payload);
};
