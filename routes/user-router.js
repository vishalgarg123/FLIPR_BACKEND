const express = require("express");
const router = express.Router();

const {
  signup_controller,
  signin_controller,
} = require("../controllers/user-controller");


//create the router

router.post("/signup", signup_controller);
router.post("/signin", signin_controller);


module.exports=router;