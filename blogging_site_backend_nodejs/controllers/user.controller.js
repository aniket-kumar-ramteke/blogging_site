const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
const dotenv = require("dotenv");

dotenv.config();

function signUp(request, response) {

    const user = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
    }

    const validationSchema = {
        name: { type: "string", optional: false, max: "100" },
        email: { type: "email", optional: false },
        password: { type: "string", optional: false, min: 8 }
    };

    const validator = new Validator();
    const validationResult = validator.validate(user, validationSchema);

    if (validationResult !== true) {
        return response.status(400).json({
            message: "Validation failed",
            errors: validationResult
        })
    }

    models.User.findOne({ where: { email: request.body.email } })
        .then((result) => {
            if (result) {
                response.status(409).json({
                    message: "Email already exists!"
                });
            } else {
                bcryptjs.genSalt(10, (error, salt) => {
                    bcryptjs.hash(request.body.password, salt, (error, hash) => {
                        const user = {
                            name: request.body.name,
                            email: request.body.email,
                            password: hash
                        }

                        models.User.create(user)
                            .then((result) => {
                                response.status(201).json({
                                    message: "User created successfully!"
                                })
                            })
                            .catch((error) => {
                                response.status(500).json({
                                    message: "Something went wrong!",
                                })
                            })
                    })
                })
            }
        }).catch((error)=>{
            response.status(500).json({
                message: "Something went wrong!",
                error: error
            })
        });
}

function login(request, response) {

    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const validationSchema = {
        email: { type: "email", optional: false },
        password: {
            type: "string",
            optional: false,
            min: 8
        }
    };

    const validator = new Validator();
    const validationResult = validator.validate(user, validationSchema);

    if (validationResult !== true) {
        return response.status(400).json({
            message: "Validation failed",
            errors: validationResult
        })
    }

    models.User.findOne({ where: { email: request.body.email } })
        .then((user) => {
            if (user === null) {
                response.status(401).json({
                    message: "Invalid Credentials!"
                });
            } else {
                bcryptjs.compare(request.body.password, user.password, (error, result) => {
                    if (result) {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user.id
                        }, process.env.JWT_KEY, (error, token) => {
                            response.status(200).json({
                                message: "Authentication successful!",
                                token: token
                            });
                        });
                    } else {
                        response.status(401).json({
                            message: "Invalid Credentials!"
                        });
                    }
                })
            }
        })
        .catch((error) => {
            response.status(500).json({
                message: "Something went wrong!",
            })
        })
}

module.exports = { signUp: signUp, login: login }