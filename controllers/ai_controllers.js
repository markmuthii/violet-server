const { generateBookDetails } = require('../ai_service/aiservice');
require('dotenv').config();

const getBookDetails = async(req, res) => {
    const { bookName, bookAuthor } = req.body;
    try {
        const bookDetails = await generateBookDetails({ bookName, bookAuthor });
        res.status(200).send({ bookDetails });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { getBookDetails };