const Book = require("../models/book");
const User = require("../models/user");
const Request = require('../models/requests');

//get details of book from req.body
//check if book title already exists
//if it does inform the user
//if it doesnt, create book
//create book
//save book
//if theres an error, send a message to the user

const createBook = async (req, res) => {
 
  const {
    title,
    author,
    genre,
    description,
    rating,
    personalComments,
    statusOfBook,
    stateOfBook,
    image,
  } = req.body;
  const { file } = req;

  console.log(req.file);

  const userId = req.user.id;
  try {
    

    const bookExists = await Book.findOne({ title: title, author: author });
    if (bookExists) {
      return res.status(400).send({ error: "Book with the same title and author already exists" });
    }
    
    const user = await User.findById(userId); // Validate userId
    if (!user) return res.status(404).send("User not found");

    const book = new Book({
      creator: userId,
      title: title,
      author: author,
      genre: genre,
      description: description,
      rating: rating,
      personalComments: personalComments,
      statusOfBook: statusOfBook,
      stateOfBook: stateOfBook,
      image: image,
      file: file?.filename,
    });

     

    await book.save();
    res.status(201).send(book);
  } catch (error) {
    //res.status(500).send(error.message);
    console.log(error);
  }
};

const createManyBooks = async (req, res) => {
  const booksData = req.body;
  try {
    //gets id of all users
    const booksWithUser = booksData.map((book) => ({
      ...book,
      creator: req.user.id,
    }));

    const books = await Book.insertMany(booksWithUser);

    if (!books)
      return res.send({ message: "Books could not be inserted" }).status(404);

    return res.send(books).status(201);
  } catch (error) {
    res.send(error.message).status(500);
  }
};

const getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }
    return res.status(200).send(book);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getBooks = async (req, res) => {
  const { search } = req.query;
  console.log(search);
  try {
    let books = await Book.find({}).populate("creator");

    //search functionality

    //Find books based on query object
    books = await Book.find({
      $or: [
        { title: { $regex: new RegExp(search, "i") } },
        { author: { $regex: new RegExp(search, "i") } },
        { genre: { $regex: new RegExp(search, "i") } },
      ],
    }).populate("creator");

    res.status(200).send({ count: books.length, books: books });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message }).status(500);
  }
};
//try catch block
//get id of book and data from body
//find book by id and update
//if not found , return error message
//catch errors

const updateBook = async (req, res) => {
  const { id } = req.params;
  //gets updated fields from body
  const {
    title,
    author,
    genre,
    description,
    rating,
    personalComments,
    statusOfBook,
    stateOfBook,
    image,
  } = req.body;
  console.log(req.body);
  const file = req?.file.filename;

  console.log(id);
  try {
    const existingBook = await Book.findById(id);
    console.log(existingBook);
    if (!existingBook) {
      return res.status(404).send({ error: "Book not found" });
    }

    existingBook.title = title;
    existingBook.author = author;
    existingBook.genre = genre;
    existingBook.description = description;
    existingBook.rating = rating;
    existingBook.personalComments = personalComments;
    existingBook.statusOfBook = statusOfBook;
    existingBook.stateOfBook = stateOfBook;
    existingBook.image = image;
    existingBook.file = file;

    await existingBook.save();

    res.status(200).send(existingBook);
  } catch (error) {
    res.send({ error: error.message }).status(500);
  }
};

// use try catch block
//look for book using id
// if not there send error
//use findbyid and delete

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book)
      return res.status(404).send({ message: `Book with id ${id} not found` });

    res.send({ message: `Book with id ${id} deleted` }).status(200);
  } catch (error) {
    res.send({ error: error.message }).status(500);
  }
};

const deleteAllBooks = async (req, res) => {
  try {
    const result = await Book.deleteMany();
    console.log(`Deleted ${result.deletedCount} books.`); // Log the number of deleted books

    return res.status(204).send(); // No content to return after deletion
  } catch (error) {
    console.error("Error deleting books:", error); // More descriptive error logging
    return res.status(500).send({ error: error.message });
  }
};

const bookAdded = async (req, res) => {
  const id = req.user.id;
  try {
    const books = await Book.find({ creator: id });
    res.status(200).send(books);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const bookLikes = async(req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    if (!book)
      return res.status(404).send({ message: `Book with id ${id} not found` });
    res.status(200).send(book);
}
catch(error){
  console.error("Error updating book likes:", error);
  return res.status(500).send({ error: error.message });
}}

const bookDislike = async(req, res) => {
  const { id } = req.params;
  try {
    let book = await Book.findById(id);
    if(book.likes > 0){
     book = await Book.findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true });
    if (!book)
      return res.status(404).send({ message: `Book with id ${id} not found` });
  }
    res.status(200).send(book);
}
catch(error){
  console.error("Error updating book likes:", error);
  return res.status(500).send({ error: error.message });
}}

const resetLikes = async(req, res) => {
  const { id } = req.params;
  try {
    let book = await Book.findByIdAndUpdate(id, { $set: { likes: 0 } }, { new: true });
    if (!book)
      return res.status(404).send({ message: `Book with id ${id} not found` });
  
    res.status(200).send(book);
}
catch(error){
  console.error("Error updating book likes:", error);
  return res.status(500).send({ error: error.message });
}}


module.exports = {
  getBook,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  createManyBooks,
  deleteAllBooks,
  bookAdded,
  bookLikes,
  bookDislike,
  resetLikes
};
