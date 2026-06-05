const Joi = require('joi');

// validation
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json({ message: errorMessage });
    }
    next();
};

// dang ky
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username phải có ít nhất 3 ký tự'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'string.empty': 'Email không được để trống'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
    })
});
//dang nhap
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
//tao bai viet
const postSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Tiêu đề không được để trống'
    }),
    content: Joi.string().required().messages({
        'string.empty': 'Nội dung không được để trống'
    }),
    // image: Joi.string().required().messages({
    //     'string.empty': 'Ảnh không được để trống'
    // }),
    image: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.min': 'Phải có ít nhất 1 tag',
        'any.required': 'Tags không được để trống'
    })
});

module.exports = {
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validatePost: validate(postSchema)
};