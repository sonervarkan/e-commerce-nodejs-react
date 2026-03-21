 
import sequelize from "../config/database.js";

import Role from "./Role.js";
import User from "./User.js";
import Customer from "./Customer.js";

import Category from "./Category.js";
import Brand from "./Brand.js";
import Model from "./Model.js";
import BrandModelMap from "./BrandModelMap.js";
import Product from "./Product.js";
import Stock from "./Stock.js";
import Supplier from "./Supplier.js";
import ProductSupplierDetail from "./ProductSupplierDetail.js";

import CustomerCart from "./CustomerCart.js";
import CustomerOrder from "./CustomerOrder.js";
import CustomerOrderItems from "./CustomerOrderItems.js";

import GuestCart from "./GuestCart.js";
import GuestOrder from "./GuestOrder.js";
import GuestOrderItems from "./GuestOrderItems.js";


/* ===============================
   ROLE - USER
================================= */
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

/* ===============================
   USER - CUSTOMER
================================= */
User.hasOne(Customer, { foreignKey: "user_id" });
Customer.belongsTo(User, { foreignKey: "user_id" });

/* ===============================
   CATEGORY - BRAND
================================= */
Category.hasMany(Brand, { foreignKey: "category_id" });
Brand.belongsTo(Category, { foreignKey: "category_id" });

/* ===============================
   BRAND - MODEL - BRANDMODEL MAP
================================= */
Brand.hasMany(BrandModelMap, { foreignKey: "brand_id" });
BrandModelMap.belongsTo(Brand, { foreignKey: "brand_id" });

Model.hasMany(BrandModelMap, { foreignKey: "model_id" });
BrandModelMap.belongsTo(Model, { foreignKey: "model_id" });

/* ===============================
   PRODUCT - BRANDMODELMAP
================================= */
BrandModelMap.hasMany(Product, { foreignKey: "brand_model_map_id" });
Product.belongsTo(BrandModelMap, { foreignKey: "brand_model_map_id" });

/* ===============================
   PRODUCT - STOCK
================================= */
Product.hasOne(Stock, { foreignKey: "product_id" });
Stock.belongsTo(Product, { foreignKey: "product_id" });

/* ===============================
   SUPPLIER - PRODUCT
================================= */
Product.belongsToMany(Supplier, {through: ProductSupplierDetail,foreignKey: "product_id"});
Supplier.belongsToMany(Product, {through: ProductSupplierDetail,foreignKey: "supplier_id"});

/* ===============================
   CUSTOMER - CUSTOMERCART
================================= */
Customer.hasMany(CustomerCart, { foreignKey: "customer_id" });
CustomerCart.belongsTo(Customer, { foreignKey: "customer_id" });

/* ===============================
   PRODUCT - CUSTOMERCART
================================= */
Product.hasMany(CustomerCart, { foreignKey: "product_id" });
CustomerCart.belongsTo(Product, { foreignKey: "product_id" });

/* ===============================
   CUSTOMER - CUSTOMERORDER
================================= */
Customer.hasMany(CustomerOrder, { foreignKey: "customer_id" });
CustomerOrder.belongsTo(Customer, { foreignKey: "customer_id" });

/* ===============================
   PRODUCT - CUSTOMERORDERITEMS
================================= */
Product.hasMany(CustomerOrderItems, {foreignKey: "product_id"});
CustomerOrderItems.belongsTo(Product, {foreignKey: "product_id"});

/* ===============================
   CUSTOMERORDER - CUSTOMERORDERITEMS
================================= */
CustomerOrder.hasMany(CustomerOrderItems, {foreignKey: "customer_order_id"});
CustomerOrderItems.belongsTo(CustomerOrder, {foreignKey: "customer_order_id"});

/* ===============================
   PRODUCT - GUESTCART
================================= */
Product.hasMany(GuestCart, { foreignKey: "product_id" });
GuestCart.belongsTo(Product, { foreignKey: "product_id" });

/* ===============================
   PRODUCT - GUESTORDERITEMS
================================= */
Product.hasMany(GuestOrderItems, {foreignKey: "product_id"});
GuestOrderItems.belongsTo(Product, {foreignKey: "product_id"});

/* ===============================
GUESTORDER - GUESTORDERITEMS
================================= */
GuestOrder.hasMany(GuestOrderItems, {foreignKey: "guest_order_id"});
GuestOrderItems.belongsTo(GuestOrder, {foreignKey: "guest_order_id"});  

export {
   sequelize,
   Role,
   User,
   Customer,
   Category,
   Brand,
   Model,
   BrandModelMap,
   Product,
   Stock,
   Supplier,
   ProductSupplierDetail,
   CustomerCart,
   CustomerOrder,
   CustomerOrderItems,
   GuestCart,
   GuestOrder,
   GuestOrderItems
};