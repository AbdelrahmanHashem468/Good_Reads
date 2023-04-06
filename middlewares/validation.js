const Joi = require("joi");
const { BaseError } = require("../libs");

const validation = (schema) => async (req, res, next) => {
    const validationErr = [];
    ['body', 'params', 'query'].forEach((key) => {
        if (schema[key]) {
            const validation = schema[key].validate(req[key]);
            if (validation.error) {
                validationErr.push(validation.error);
            }
        }
    });
    if (validationErr.length > 0) {
        next(new BaseError(`validation error ${validationErr[0].details[0].message}`, 422))

    } else {
        next();
    }
};

const AuthorValidator = {
    create: {
        body: Joi.object().keys({
            firstName: Joi.string().required().min(3),
            lastName: Joi.string().required().min(3),
            DOB: Joi.date().required()
        })
    },
    update: {
        body: Joi.object().keys({
            firstName: Joi.string().min(3),
            lastName: Joi.string().min(3),
            DOB: Joi.date()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    },
    idParam: {
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    }
}

const CategoryValidator = {
    create: {
        body: Joi.object().keys({
            Name: Joi.string().required().min(3),
        })
    },
    update: {
        body: Joi.object().keys({
            Name: Joi.string().min(3),

        }),
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    },

    idParam: {
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    }
}

const BookValidator = {
    create: {
        body: Joi.object().keys({
            name: Joi.string().required().min(3),
            categoryId: Joi.string().length(24).required(),
            authorId: Joi.string().length(24).required(),
        })
    },
    update: {
        body: Joi.object().keys({
            name: Joi.string().min(3),
            categoryId: Joi.string().length(24),
            authorId: Joi.string().length(24),
        }),
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    },
    idParam: {
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    },
    reviews:{
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
        body: Joi.object().keys({
            comment: Joi.string().max(500)
        })
    }

}

const UsersValidator = {
    login: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8),
        })
    },
    signUp: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8),
            cPassword: Joi.string().valid(Joi.ref('password')).required(),
            firstName: Joi.string().required().min(3),
            lastName: Joi.string().required().min(3),
            DOB: Joi.date().required(),
        })
    },
    update: {
        body: Joi.object().keys({
            email: Joi.string().email(),
            password: Joi.string().min(8),
            firstName: Joi.string().min(3),
            lastName: Joi.string().min(3),
            DOB: Joi.date(),
        })
    },
    shelf: {
        body: Joi.object().keys({
            shelf: Joi.string().valid('currently reading', 'read', 'want to read'),
            rating: Joi.number().min(1).max(5)
        })
        , params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    },
    idParam: {
        params: Joi.object().required().keys({
            id: Joi.string().length(24).required(),
        }),
    }
}

module.exports = { validation, AuthorValidator, CategoryValidator, BookValidator, UsersValidator };
