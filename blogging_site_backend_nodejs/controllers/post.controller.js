const Validator = require("fastest-validator");
const models = require("../models");

function save(request, response) {
    const post = {
        title: request.body.title,
        content: request.body.content,
        imageUrl: request.body.image_url,
        userId: request.userData.userId
    }

    const validationSchema = {
        title: { type: "string", optional: false, max: "100" },
        content: { type: "string", optional: false, max: "500" }
    }

    const validator = new Validator();
    const validationResult = validator.validate(post, validationSchema);

    if (validationResult !== true) {
        return response.status(400).json({
            message: "Validation failed",
            errors: validationResult
        })
    }

    models.Post.create(post)
        .then((result) => {
            response.status(201).json({
                message: "Post created successfully!",
                post: result
            })
        })
        .catch((error) => {
            response.status(500).json({
                message: "Something went wrong!",
                error: error
            })
        })
}

function show(request, response) {
    const id = request.params.id;

    models.Post.findByPk(id)
        .then((result) => {
            if (result) {
                response.status(200).send(result);
            } else {
                response.status(404).json({
                    message: "Post not Found!"
                })
            }
        })
        .catch((error) => {
            response.status(500).json({
                message: "Something went wrong!",
                post: error
            })
        })
}

function showAll(request, response) {
    models.Post.findAll()
        .then((result) => {
            response.status(200).send(result);
        })
        .catch((error) => {
            response.status(500).json({
                message: "Something went wrong!",
                post: error
            })
        });
}

function update(request, response) {
    const id = request.params.id;
    const updatedPost = {
        title: request.body.title,
        content: request.body.content,
        imageUrl: request.body.image_url
    }

    const userId = request.userData.userId;
    
    const validationSchema = {
        title: { type: "string", optional: false, max: "100" },
        content: { type: "string", optional: false, max: "500" }
    }

    const validator = new Validator();
    const validationResult = validator.validate(updatedPost, validationSchema);

    if (validationResult != true) {
        return response.status(400).json({
            message: "Validation failed",
            errors: validationResult
        })
    }

    models.Post.update(updatedPost, { where: { id: id, userId: userId } })
        .then((result) => {
            if (result != 0) {
                response.status(200).json({
                    message: "Post updated successfully!",
                    post: result
                })
            } else {
                response.status(404).json({
                    message: "Post not Found!"
                })
            }
        })
        .catch((error) => {
            response.status(500).json({
                message: "Something went wrong!",
                error: error
            })
        })
}

function deleteById(request, response) {
    const id = request.params.id;
    const userId = request.userData.userId;

    models.Post.destroy({ where: { id: id, userId: userId } })
        .then((result) => {
            if (result != 0) {
                response.status(200).json({
                    message: "Post deleted successfully!"
                })
            } else {
                response.status(404).json({
                    message: "Post not Found!"
                })
            }
        })
        .catch((error) => {
            response.status(500).json({
                message: "Something went wrong!",
                error: error
            })
        })
}

module.exports = {
    save: save,
    show: show,
    showAll: showAll,
    update: update,
    deleteById: deleteById
}