const userModel=require('../models/user-model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//create the signup controller  
// api - POST:- /signup
exports.signup_controller = async (req, res) => {
  const { email, password, name } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user already exists
    const user = await userModel.findOne({ email });
    
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Proceed with creating the user
    const newUser = new userModel({
      email,
      password: hash,  // Store the hashed password
      name
      // Add other fields if needed
    });

    await newUser.save();

    // Respond with a success message and the new user's ID
    res.status(201).json({ message: "User successfully created", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//create the signin controller
// POST :- /signin
exports.signin_controller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if the user exists by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
          console.error("Error:", err.message);
          return res.status(500).send({ error: 'Server error' });
      }

      if (result) {
          let token = jwt.sign({ email, id: user._id }, process.env.JWT_KEY, {
              expiresIn: "12h"
          });
          res.cookie("token", token);
          

          // Send the token in the response along with the success message
          return res.status(200).send({
              message: 'Login successful',
              token: token  // Include the token here
          });
        }
          else {
            return res.status(401).send({ error: 'Password is incorrect' });
        }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJwtToken();
  res
    .status(codeStatus)
    .cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .json({ msg:"SignIn Successfully", token });
};


