const express = require('express');
const router = express.Router();

const { getBookDetails } = require('../controllers/ai_controllers');

router.post('/api/fetchBookDetails', getBookDetails);

module.exports = router;