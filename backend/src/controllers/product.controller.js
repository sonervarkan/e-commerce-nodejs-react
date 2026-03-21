 
import productService from "../services/product.service.js";

const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      brand_name,
      model_name,
      product_description,
      long_description,
      price,
      discounted_price,
      stock_quantity,
      first_name,
      last_name,
      company_name,
      supplier_phone,
      supplier_email
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const productData = {
      category_id: parseInt(category_id),
      brand_name,
      model_name,
      product_description,
      long_description,
      price: parseFloat(price),
      discounted_price: discounted_price ? parseFloat(discounted_price) : null,
      image_url,
      stock_quantity: parseInt(stock_quantity) || 0,
      first_name, 
      last_name,
      company_name, 
      supplier_phone, 
      supplier_email
    };

    const newProduct = await productService.createFullProduct(productData);

    return res.status(201).json({
      success: true,
      message: "The product has been successfully created.",
      data: newProduct
    });
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "The product and its file have been successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (updateData.price === '') delete updateData.price;
    else if (updateData.price) updateData.price = parseFloat(updateData.price);

    if (updateData.discounted_price === '') {
      updateData.discounted_price = null; 
    } else if (updateData.discounted_price) {
      updateData.discounted_price = parseFloat(updateData.discounted_price);
    }

    if (updateData.stock_quantity === '') {
      updateData.stock_quantity = 0;
    } else if (updateData.stock_quantity) {
      updateData.stock_quantity = parseInt(updateData.stock_quantity);
    }

    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await productService.updateProduct(id, updateData);

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("🔍 Gelen productId:", productId);
    
    const product = await productService.getProductById(productId);
    console.log("🔍 Bulunan product:", product ? "Var" : "Yok");

    if (!product) {
      return res.status(404).json({ message: "No product with this ID was found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET_PRODUCT_BY_ID_ERROR:", error); 
    res.status(500).json({ 
      message: "A server error occurred.", 
      error: error.message
    });
  }
};


export default { 
  createProduct, 
  getProducts, 
  deleteProduct, 
  updateProduct,
  getProductById 
};