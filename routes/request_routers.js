const express = require('express');
const router = express.Router();
const { createRequest, requestToBook, getRequest,getRequests, requestAdded, deleteRequest, updateRequest, requestLikes, requestDislike, resetLikes } = require('../controllers/request_controllers');

router.get('/requests-added', requestAdded);
router.post('/', createRequest);
router.patch('/new-book/:id', requestToBook);
router.get('/', getRequests);
router.get('/:id', getRequest)
router.delete('/:id', deleteRequest);
router.patch('/:id', updateRequest);
router.patch('/like/:id', requestLikes);
router.patch('/reset-likes/:id', resetLikes);
router.patch('/dislike/:id', requestDislike);


module.exports = router;
