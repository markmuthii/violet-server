const express = require('express');
const router = express.Router();
const { upload } = require('../utils/fileHandler');


const { getBook, getBooks, createBook, createManyBooks, updateBook, deleteBook, deleteAllBooks, bookAdded, bookLikes,bookDislike, resetLikes} = require('../controllers/book_controllers');


router.get('/books-added', bookAdded);
router.get('/', getBooks);
router.delete('/delete', deleteAllBooks);
router.get('/:id', getBook);
router.post('/', upload.single("file"), createBook);
router.post('/create-many', createManyBooks);
router.patch('/:id', upload.single('file'), updateBook);
router.delete('/:id', deleteBook);
router.patch('/like/:id', bookLikes);
router.patch('/reset-likes/:id', resetLikes);
router.patch('/dislike/:id', bookDislike);

module.exports = router;