const productModel = require("../models/product-model");

// create the proudct model
//API :- post /addproduct
exports.addproducts = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validate the required fields
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ error: "ALL Field are required necessary." });
    }

    // Create the boxSize entry
    const product = await productModel.create({
      name,
      description,
      price,
      category
    });

    // Respond with the created resource
    return res.status(201).json({
      message: "Product added Successfully",
      productId: product._id,
    });
  } catch (err) {
    // Log the error for debugging
    console.error("error :", err);

    // Return a 500 error response
    return res
      .status(500)
      .json({ error: "error", details: err.message });
  }
};
exports.getallproducts = async (req, res) => {
  try {
    // Parse query parameters with default values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Fetch box sizes with pagination
    const products = await productModel.find({}).skip(skip).limit(limit);

    // Get the total count of box sizes
    const totalproducts = await productModel.countDocuments();

    // Return paginated response
    res.status(200).json({
      success: true,
      data: {
        products,
        totalproducts,
        totalPages: Math.ceil(totalproducts / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching product:", error);

    // Return a 500 error response with a meaningful message
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }

};

exports.getproductbyId=async(req,res)=>{
  try {
    // Retrieve the boxSize by ID
    const product = await productModel.findById(req.params._productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "products not found",
      });
    }

    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    // Log the error for debugging
    console.error("Error fetching producy by ID:", err);

    // Handle cases where the ID is invalid (e.g., not a valid ObjectId)
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    // Return a 500 error response for any other server errors
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching product",
      error: err.message,
    });
  }
}


exports.updateproducts = async (req, res) => {
  try {
    // Find the boxSize by ID and update it with the new data
    const updatedproducts = await productModel.findByIdAndUpdate(
      req.params._productId,
      req.body,
      { new: true, runValidators: true }
    );

    // If no document is found, return a 404 error
    if (!updatedproducts) {
      return res.status(404).json({
        success: false,
        message: "products not found",
      });
    }

    // Return the updated document
    return res.status(200).json({
      success: true,
      message: "product updated successfully",
      data: updatedproducts,
    });
  } catch (err) {
    // Log the error for debugging
    console.error("Error updating product:", err);

    // Handle invalid ObjectId errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid boxSize ID format",
      });
    }

    // Return a 500 error response for any other server errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating products",
      error: err.message,
    });
  }
};


exports.deleteproducts = async (req, res) => {
  try {
    // Attempt to find and delete the boxSize by ID
    const deletedproduct = await productModel.findByIdAndDelete(req.params._productId);

    // If no document is found, return a 404 error
    if (!deletedproduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    // Return a success message upon deletion
    return res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (err) {
    // Log the error for debugging
    console.error("Error deleting product:", err);

    // Handle invalid ObjectId errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    // Return a 500 error response for any other server errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting products",
      error: err.message,
    });
  }

};
