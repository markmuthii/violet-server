const User = require("../models/user");
const bcrypt = require("bcryptjs");

//retrieve data from request
//use data to check if user already exists
//if they exist then send a message and stop them from creating a new user
//if a new user,
//hash their password
//create the new user
//save that user
//if there is an error send the error message

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, username, phoneNumber } = req.body;
  console.log({
    firstName,
    lastName,
    email,
    password,
    username,
    phoneNumber
  });

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: `User with email ${email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      username: username,
      isActive: true,
      //profilePicture: req.file.filename,
    });

    await newUser.save();

    if (!newUser) {
      return res
        .send({ message: "Failed to create new user try again later" })
        .status(404);
    }

    return res.send({ 'Success': `User ${newUser} created successfully`}).status(200);
    
  } catch (error) {
    res.send({ Error: error.message }).status(500);
  }
};

module.exports = { registerUser };
