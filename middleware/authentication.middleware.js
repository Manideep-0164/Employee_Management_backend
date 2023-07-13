require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

const authentication = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Please Login" });
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, docode) => {
      if (err) {
        console.log(err);
        return res.status(404).json({ error: "Something went wrong" });
      }
      const userExists = await UserModel.findOne({ Email: docode.userEmail });
      if (!userExists)
        return res.json({ message: "User does not exists, Please Register" });
      req.body.creator = docode.userEmail;
      next();
    });
  } catch (error) {}
};

module.exports = { authentication };
