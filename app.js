require('dotenv').config()
const express = require("express");
const app = express();
const db=require("./config/mongoose-conn")

const userRouter=require("./routes/user-router")
const productRouter=require("./routes/product-router")
const orderRouter=require("./routes/order-router")
const cartRouter=require("./routes/cart-router")
const bodyParser=require("body-parser")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
// create the user router
app.use('/',userRouter)
//create the product router
app.use("/",productRouter)
//create the cart router
app.use('/cart',cartRouter)

app.use('/',orderRouter)

//create the server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
