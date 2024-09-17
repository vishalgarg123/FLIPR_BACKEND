const express = require("express");
const { addproducts,updateproducts,deleteproducts,getallproducts, getproductbyId } = require("../controllers/product-controller");
const {  verifyToken } = require("../middlewares/auth-middleware");
const router = express.Router();


router.post("/addproduct",verifyToken,addproducts)
router.put("/updateproduct/:_productId",verifyToken,updateproducts)
router.get("/products",verifyToken,getallproducts)
router.delete("/deleteproduct/:_productId",verifyToken,deleteproducts)
router.get('/product/:_productId',verifyToken,getproductbyId)



module.exports=router;