const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");


const PORT = process.env.PORT || 5000;
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
//connecting the database
const { connect_db } = require('./db/connect');

connect_db();



//base route
app.get("/", (req, res) => {
  try {
    res.send({ message: "The server is up and running!!!" }).status(200);
  } catch (error) {
    res.send({ error: error.message });
  }
});

//Imports
const { verifyToken } = require('./middleware/Authenticate');
  //routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book_routers');
const userRoutes = require('./routes/user_routers');
const requestRoutes = require('./routes/request_routers');
const commentRoutes = require('./routes/comment_routers');
const aiRoutes = require('./routes/ai_routers');
const myBooksRoutes = require('./routes/myBooks_routers');



//Routes
app.use('/auth', authRoutes);
app.use('/books',verifyToken, bookRoutes);
app.use('/users',verifyToken, userRoutes);
app.use('/myBooks',verifyToken, myBooksRoutes);
app.use('/requests',verifyToken, requestRoutes);
app.use('/ai', verifyToken, aiRoutes);
app.use('/comments', verifyToken, commentRoutes);


//start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});