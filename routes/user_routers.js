const express = require('express');
const router = express.Router();

const { getUser,getUserV2, getUsers, updateUser, deleteUser, addToMyBooks, getMyBooks, deleteMyBook,deleteAllMyBooks, recommendationsFeed,postGenres } = require('../controllers/user_controllers');

const { getCommentsByUser } = require('../controllers/comment_controllers')

router.get('/', getUsers);
router.get('/collections', getMyBooks);
router.get('/recommendations/:userId', recommendationsFeed);
router.delete('/collections/:id', deleteMyBook);
router.delete('/collections', deleteAllMyBooks);
router.get('/user', getUserV2);
router.get('/user-comments', getCommentsByUser);
router.post('/collection', addToMyBooks);
router.post('/recommendations', postGenres);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;