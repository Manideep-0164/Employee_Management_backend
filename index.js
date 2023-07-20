const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connection = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { empRouter } = require("./routes/emp.route");
const { authentication } = require("./middleware/authentication.middleware");

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await connection;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);      // to exit the process due to an error.
  }
}

app.get("/", async(req, res) => {
  res.send("Server running");
});

app.use("", userRouter);
app.use(authentication);
app.use("", empRouter);

// To handle not registered routes
app.all('*', (req, res) => {
  res.status(404).send('404 - Page Not Found');
});

//Connect to the database before listening
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at the port: ${port}`);
    })
})

// app.listen(port, async () => {
//   try {
//     await connection;
//     console.log("Connected to DB");
//   } catch (error) {
//     console.log(error);
//   }
//   console.log(`Server is running at the port: ${port}`);
// });
