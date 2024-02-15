const Validator = require('fastest-validator');
const models = require('../models');

function save(request, response) {
    const comment = {
        content: request.body.content,
        postId: request.body.post_id,
        userId: request.userData.userId
    }

    const validationSchema = {
        content: { type: "string", optional: false, max: "500" },
        postId: { type: "number", optional: false }
    }

    const validator = new Validator();
    const validationResult = validator.validate(comment, validationSchema);

    if (validationResult !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResult
        });
    }

    models.Post.findByPk(request.body.post_id).then(post => {
        if (post === null) {
            response.status(404).json({
                message: "Post not found"
            });
        } else {
            models.Comment.create(comment).then(result => {
                response.status(201).json({
                    message: "Comment created successfully",
                    comment: result
                });
            }).catch(error => {
                response.status(500).json({
                    message: "Something went wrong",
                    error: error
                });
            });
        }

    }).catch(error => {
        response.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}


function show(request, response) {
    const id = request.params.id;

    models.Comment.findByPk(id).then(result => {
        if (result) {
            response.status(200).json(result);
        } else {
            response.status(404).json({
                message: "Comment not found!"
            })
        }
    }).catch(error => {
        response.status(500).json({
            message: "Something went wrong!"
        })
    });
}


function showAll(request, response) {
    models.Comment.findAll().then(result => {
        response.status(200).json(result);
    }).catch(error => {
        response.status(500).json({
            message: "Something went wrong!"
        });
    });
}


function update(request, response) {
    const id = request.params.id;
    const updatedComment = {
        content: request.body.content
    }

    const userId = request.userData.userId;

    const validationSchema = {
        content: { type: "string", optional: false, max: "500" },
    }

    const validator = new Validator();
    const validationResult = validator.validate(updatedComment, validationSchema);

    if (validationResult !== true) {
        return response.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.Comment.update(updatedComment, { where: { id: id, userId: userId } }).then(result => {
        response.status(200).json({
            message: "Comment updated successfully",
            post: updatedComment
        });
    }).catch(error => {
        response.status(200).json({
            message: "Something went wrong",
            error: error
        });
    })
}


function deleteById(request, response) {
    const id = request.params.id;
    const userId = request.userData.userId;

    models.Comment.destroy({ where: { id: id, userId: userId } }).then(result => {
        response.status(200).json({
            message: "Comment deleted successfully"
        });
    }).catch(error => {
        response.status(200).json({
            message: "Something went wrong",
            error: error
        });
    });
}

module.exports = {
    save: save,
    show: show,
    showAll: showAll,
    update: update,
    deleteById: deleteById
}