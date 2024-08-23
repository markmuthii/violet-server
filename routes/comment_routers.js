const express = require('express');
const router = express.Router();



const { createComment, getComments,deleteComment } = require('../controllers/comment_controllers');

router.get('/:bookId', getComments);
router.post('/', createComment);
router.delete('/:id', deleteComment);

module.exports = router;