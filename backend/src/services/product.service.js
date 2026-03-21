 
import fs from "fs";
import path from "path";
import {  sequelize, Category, Brand, Model, BrandModelMap, 
  Supplier, ProductSupplierDetail, Product, Stock } from "../models/index.js";

const createFullProduct = async (productData) => {
  
  const t = await sequelize.transaction();

  try {
    const { category_id, brand_name, model_name, product_description, long_description,
      price, discounted_price, image_url, stock_quantity, first_name, last_name,
      company_name, supplier_phone, supplier_email } = productData;

    const [brand] = await Brand.findOrCreate({
      where: { brand_name, category_id },
      transaction: t
    });

    const [model] = await Model.findOrCreate({
      where: { model_name },
      transaction: t
    });

    const [brandModelMap] = await BrandModelMap.findOrCreate({
      where: { 
        brand_id: brand.id, 
        model_id: model.id 
      },
      transaction: t
    });

    const newProduct = await Product.create({
      product_description,
      long_description,
      price,
      discounted_price,
      image_url,
      brand_model_map_id: brandModelMap.id
    }, { transaction: t });


    if (stock_quantity !== undefined) {
      await Stock.create({
        product_id: newProduct.id,
        quantity: stock_quantity
      }, { transaction: t });
    }

    const [supplier]= await Supplier.findOrCreate({
      where:{
        first_name:first_name,
        last_name:last_name,
        company_name:company_name,
        phone:supplier_phone,
        email:supplier_email
      }, transaction:t
    });

    const [productSupplierDetail]= await ProductSupplierDetail.findOrCreate({
      where:{
        product_id:newProduct.id,
        supplier_id:supplier.id
      }, transaction:t
    });

    await t.commit();
    
    return newProduct;

    } catch (error) {
    await t.rollback();
    throw error;
    }
};


const getAllProducts = async () => {
  try {
    return await Product.findAll({
      include: [
        {
          model: BrandModelMap,
          include: [
            { model: Brand, include: [Category] },
            { model: Model }
          ]
        },
        { 
          model: Stock 
        }
      ],
      order: [['created_at', 'DESC']]
    });
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found.");

  if (product.image_url) {
    const filePath = path.join(process.cwd(), "public", product.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return await product.destroy();
};

const updateProduct = async (id, updateData) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: BrandModelMap, 
          include: 
          [
            Brand, Model
          ]
      }, 
      { 
        model: Stock 
      }
    ]
  });

  if (!product) throw new Error("Product not found.");

  await product.update({
    product_description: updateData.product_description,
    long_description: updateData.long_description,
    price: updateData.price,
    discounted_price: updateData.discounted_price,
    image_url: updateData.image_url || product.image_url
  });

  if (product.Stock) {
    await product.Stock.update({ quantity: updateData.stock_quantity });
  }

  if (product.BrandModelMap) {
    const { Brand: brand, Model: model } = product.BrandModelMap;

    if (brand) {
      await brand.update({
        brand_name: updateData.brand_name,
        category_id: updateData.category_id
      });
    }

    if (model) {
      await model.update({
        model_name: updateData.model_name
      });
    }
  }

  return product;
};

const getProductById = async (productId) => {
  console.log("The productId that is searched for in the service:", productId);
  
  const product = await Product.findOne({
    where: { id: productId },
    include: [
      {
        model: BrandModelMap,
        include: [
          { model: Brand },
          { model: Model }
        ]
      },
      { model: Stock }
    ]
  });
  
  console.log("Service result:", product ? "Product found" : "Product not found");
  return product;
};


export default {
  createFullProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductById
};
