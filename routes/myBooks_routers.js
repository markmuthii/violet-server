const express = require('express');
const router = express.Router();

const { addToMyBooks, getMyBooks, deleteMyBook,deleteAllMyBooks } = require('../controllers/user_controllers');


router.get('/', getMyBooks);
router.delete('/:id', deleteMyBook);
router.delete('/', deleteAllMyBooks);
router.post('/', addToMyBooks);

module.exports = router;