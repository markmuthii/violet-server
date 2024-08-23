const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get username and paswword from request body
//check if user exists
    //if they dont send message
//check if password matches
    //if not send an error message
//assign token if password is ok
    //send token back to clients
//catch errors


const loginUser = async(req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({ username: username});

        if(!user) return res.status(404).send({ 'message': `User ${username} not found` }).status(400);

        const passwordMatches = await bcrypt.compare(password, user.password);
        if(!passwordMatches) return res.status(400).send({ 'message': 'Invalid password' });

        const token = jwt.sign({user: {id :user.id, role: user.role, username: user.username}}, '2005', { expiresIn: '3h'});

        return res.send({'token': token}).status(200)

    } catch (error) {
        res.status(500).send({ 'message': error.message});
    }
};

module.exports = {
    loginUser
}

