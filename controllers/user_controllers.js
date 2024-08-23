const User = require('../models/user');
const Book = require('../models/book');
const myBook = require('../models/myBooks');
const jwt = require('jsonwebtoken');


const deleteUser = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if(!user) res.send({'error': 'User not found'}).status(404);

        res.send({'success': `User ${user} deleted successfully`}).status(200);
    } catch (error) {
        res.send({'error': error.message}).status(500)
    }
}

const getUsers = async(req, res) => {
    try {
        const users = await User.find({});

        if(!users) res.send(`No users exist`).status(404);

        res.send(users).status(200);
    } catch (error) {
        res.send({'error': error.message}).status(500)
    }
}

const getUser = async(req, res) => {
    const { id } = req.params ;

    try {
        const user = await User.findById(id);

        if(!user) res.send({'error': 'User not found'}).status(404);

        res.send(user).status(200);
    } catch (error) {
        res.send({'error': error.message}).status(500)
    }
}

const getUserV2 = async(req, res) => {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).send({message: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, "2005")
        const user = await User.findById(decoded.user.id);

        if(!user) return res.status(404).send({message: 'User Not Found'});

        res.status(200).send(user);

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

const updateUser = async(req, res) => {
    const { id } = req.params;
    const userData = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, {... userData}, {new: true});

        if(!user) res.send({'error': 'User not found'}).status(404);

        res.send(user).status(200);
    } catch (error) {
        res.send({'error': error.message}).status(500);
    }
}

//adding to myBooks
  //get userId
  //check if book exists
  //check if user exists
  //add book to user's myBooks array
  //save user
  //if theres an error, send a message to the user
  const addToMyBooks = async(req, res) => {
    const { id } = req.body

    try {
        const book = await Book.findById(id);

        /* const existingMyBook = await myBook.findOne({ book: id });


    if (existingMyBook) {
      return res
        .status(400)
        .send({ message: `Book with id ${id} already exists` });
    } */
        if (!book) return res.status(404).send('Book not found');

        const collection = await myBook.create({
            book: id,
            user: req.user.id
        });

        if (!collection) return res.status(404).send({'role': 'Error adding book to collection'});
        console.log(collection);

        return res.status(200).send(collection)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message);
    }

  };

const getMyBooks = async(req, res) => {
    const { id } = req.user;
    try {
        const myBooks = await myBook.find({user : id}).populate('book');
        res.status(200).send(myBooks);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message);
    }
}

const deleteMyBook = async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await myBook.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' }); // Use return to prevent further execution
        }

        return res.status(200).json({ success: `Book ${book._id} deleted successfully` }); // Use return to prevent further execution
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Use return to prevent further execution
    }
};


const deleteAllMyBooks = async (req, res) => {
    try {
      const result = await myBook.deleteMany();
      console.log(`Deleted ${result.deletedCount} books.`); // Log the number of deleted books
  
      return res.status(204).send(result); // No content to return after deletion
    } catch (error) {
      console.error("Error deleting books:", error); // More descriptive error logging
      return res.status(500).send({ error: error.message });
    }
  };

const postGenres = async (req, res) => {
    const { id } = req.user; // Assume userId is available in req.user from authentication
    const { genres } = req.body;

     console.log(id);
    if (!Array.isArray(genres) || genres.length === 0) {
        return res.status(400).send({ error: 'Genres must be a non-empty array of strings' });
    }

    try {
       // const user = await User.findById();
        const user = await User.findByIdAndUpdate(id, {$push:{ favoriteGenres: genres }}, { new: true });
        res.status(200).send({ message: 'Genres updated successfully' });
        console.log(user)
    } catch (error) {
        console.error('Error updating genres:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};






const recommendationsFeed = async(req, res) => {
    const recommendedGenres = req.body;
    try {
        const recommendedBooks = await Book.find({genre: {$in: recommendedGenres}});
        if(!recommendedBooks) res.send({'error': 'No books found'}).status(404);

        res.send(recommendedBooks).status(200);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { updateUser, getUser, getUserV2, getUsers, deleteUser, addToMyBooks, getMyBooks, deleteMyBook,deleteAllMyBooks, postGenres, recommendationsFeed};