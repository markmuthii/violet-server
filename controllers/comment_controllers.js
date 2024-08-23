const Comments = require('../models/comments');

const createComment = async(req, res) => {

    const { bookId, comment} = req.body;
    try{
        if(!bookId) return res.status(400).send('Book id is required');
        if(!comment) return res.status(400).send('Comments are required');
        const newComment = await Comments.create({
            book: bookId,
            user: req.user.id,
            comment: comment
        });
        res.status(201).send(newComment);
    }catch{
        res.status(500).send('Error creating comment');
    }

}

const deleteComment = async(req, res) => {
    const { id } = req.params;
    try{
        if(!id) return res.status(400).send('Comment id is required');
        const comment = await Comments.findByIdAndDelete(id);
        if(!comment) return res.status(404).send('Comment not found');
        res.send(comment).status(200);
    }catch(error){
        res.status(500).send(error.message);
    }
};

const getComments = async(req, res) => {
    const { bookId } = req.params;
    try{
        if(!bookId) return res.status(400).send('Book id is required');
        const comments = await Comments.find({book: bookId}).populate('user');
        res.send(comments);
    }catch{
        res.status(500).send('Error retrieving comments');
    }
}

const getCommentsByUser = async(req, res) => {
    
    try{
       
        const comments = await Comments.find({user: req.user.id}).populate('book');
        res.send(comments);
    }catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports = { createComment, getComments, getCommentsByUser, deleteComment };