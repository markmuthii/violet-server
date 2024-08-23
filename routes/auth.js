const express = require('express');
const { upload } = require('../utils/fileHandler');
const router = express.Router();
const { registerUser } = require('../auth/register');
const { loginUser } = require('../auth/login');

router.post('/register',upload.single("file"), registerUser);
router.post('/login', loginUser);

module.exports = router;