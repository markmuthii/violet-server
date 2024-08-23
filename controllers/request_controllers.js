const Request = require("../models/requests");
const User = require("../models/user");
const Book = require("../models/book");
const { createBook } = require("../controllers/book_controllers");

// create a new request
const createRequest = async (req, res) => {
  const { title, author, genre, image, description } = req.body;

  const { id, username } = req.user;
  
  try {
    const user = await User.findById(id); // Validate userId
    if (!user) return res.status(404).send("User not found");

    const request = new Request({
      creator: id,
      username: username,
      title: title,
      author: author,
      genre: genre,
      image: image,
      description: description,
      status: "pending",
    });

    await request.save();
    res.status(201).send(request);

    console.log(`Request created by ${username} for book: ${title}`);
  } catch (error) {

    res.status(400).send(error.message);
    console.log(error.message);
  }
};

const requestToBook = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Update the request status to 'fulfilled'
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $set: { status: "fulfilled" } },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).send({ error: "Request not found" }); // Only send a response once
    } 

    res.status(200).send({ msg: `Request fulfilled : ${updatedRequest}` }); // Only send a response once
  } catch (error) {
    // Check if the response has not been sent before
    if (!res.headersSent) {
      console.error(error);
      res.status(500).send({ error: error.message }); // Only send a response once
    }
  }
};





const getRequests = async(req, res) => {
  const { search } = req.query;
  console.log(search);
  try {
    let requests = await Request.find({ status: "pending" }).exec();

    requests = await Request.find({
      $or: [
        { title: { $regex: new RegExp(search, "i") } },
        { author: { $regex: new RegExp(search, "i") } },
        { genre: { $regex: new RegExp(search, "i") } },
      ],
    })

    res.status(200).send({count: requests.length, requests: requests});
  } catch (error) {
     res.status(500).send(error.message);
    console.log(error);
  }
};

const getRequest = async(req, res) => {
  const id = req.params.id;

  try {
    const existingRequest = await Request.findById(id);
    if(!existingRequest) res.status(404).send(`Request not found`);

    res.status(200).send(existingRequest);
  } catch (error) {
     res.status(500).send(error.message);
    console.log(error);
  }
};

const requestAdded = async (req, res) => {
  try {
    const requests = await Request.find({ creator: req.user.id });
    res.status(200).send(requests);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Request.findByIdAndDelete(id);
    if (!book)
      return res.status(404).send({ message: `Request with id ${id} not found` });

    res.send({ message: `Request with id ${id} deleted` }).status(200);
  } catch (error) {
    res.send({ error: error.message }).status(500);
  }
};

const updateRequest = async (req, res) => {
  const { id } = req.params;
  //gets updated fields from body
  const { title, author, genre, description,image } = req.body;
  

  try {
    const existingRequest = await Request.findById(id);
    if (!existingRequest) {
      console.log(`Request with id ${id} not found`);
      return res.status(404).send({ error: "Request not found" });
    }

    existingRequest.title = title;
    existingRequest.author = author;
    existingRequest.genre = genre;
    existingRequest.description = description;
    existingRequest.image = image;

    await existingRequest.save();

    res.status(200).send(existingRequest);
    
  } catch (error) {
    console.log(error);
    return res.send({ error: error.message }).status(500);
  }
};

const requestLikes = async(req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    if (!request)
      return res.status(404).send({ message: `Request with id ${id} not found` });
    res.status(200).send(request);
}
catch(error){
  console.error("Error updating request likes:", error);
  return res.status(500).send({ error: error.message });
}}

const requestDislike = async(req, res) => {
  const { id } = req.params;
  try {
    let request = await Request.findById(id);
    if(request.likes >= 0){
     request = await Request.findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true });
    if (!request)
      return res.status(404).send({ message: `Request with id ${id} not found` });
  }
    res.status(200).send(request);
}
catch(error){
  console.error("Error updating request likes:", error);
  return res.status(500).send({ error: error.message });
}}

const resetLikes = async(req, res) => {
  const { id } = req.params;
  try {
    let request = await Request.findByIdAndUpdate(id, { $set: { likes: 0 } }, { new: true });
    if (!request)
      return res.status(404).send({ message: `request with id ${id} not found` });
  
    res.status(200).send(request);
}
catch(error){
  console.error("Error updating request likes:", error);
  return res.status(500).send({ error: error.message });
}}


module.exports = { createRequest, requestToBook, getRequest, getRequests,requestAdded, deleteRequest, updateRequest, requestLikes, requestDislike, resetLikes };