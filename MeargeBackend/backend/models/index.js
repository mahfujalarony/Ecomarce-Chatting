const User = require("./Authentication");
const Address = require("./Address");
const OrderItem = require("./Order");
const MerchantProfile = require("./MerchantProfile");
const Product = require("./Product");
const MerchentStore = require("./MerchentStore");
const ProductDailyStat = require("./ProductDailyStat");
const Review = require("./Review");
const Story = require("./Story");
const Category = require("./Category");
const SubCategory = require("./SubCategory");
const GiftCard = require("./GiftCard");
const AppSetting = require("./AppSetting");
const Notification = require("./Notification");
const Offer = require("./Offer");
const SubAdminPermission = require("./SubAdminPermission");
const HomeCache = require("./HomeCache");
const AdminHistory = require("./AdminHistory");

// User <-> Address
User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

// User <-> OrderItem
User.hasMany(OrderItem, { foreignKey: "userId" });
OrderItem.belongsTo(User, { foreignKey: "userId" });

// Address <-> OrderItem
Address.hasMany(OrderItem, { foreignKey: "addressId" });
OrderItem.belongsTo(Address, { foreignKey: "addressId" });

// User <-> MerchantProfile
User.hasOne(MerchantProfile, { foreignKey: "userId", as: "merchantProfile" });
MerchantProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

// Merchant(User) <-> MerchentStore
User.hasMany(MerchentStore, { foreignKey: "merchantId", as: "products" });
MerchentStore.belongsTo(User, { foreignKey: "merchantId", as: "merchant" });

// MerchentStore <-> Review
MerchentStore.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(MerchentStore, { foreignKey: "productId", as: "product" });

// User <-> Review
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// MerchentStore <-> ProductDailyStat
MerchentStore.hasMany(ProductDailyStat, { foreignKey: "productId", as: "stats" });
ProductDailyStat.belongsTo(MerchentStore, { foreignKey: "productId", as: "product" });

// Category <-> SubCategory
Category.hasMany(SubCategory, {
  foreignKey: "categoryId",
  as: "subCategories",
  onDelete: "CASCADE",
});
SubCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// SubCategory tree (self relation)
SubCategory.hasMany(SubCategory, {
  foreignKey: "parentSubCategoryId",
  as: "children",
  onDelete: "CASCADE",
});
SubCategory.belongsTo(SubCategory, {
  foreignKey: "parentSubCategoryId",
  as: "parent",
});

// GiftCard relations
GiftCard.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
GiftCard.belongsTo(User, { foreignKey: "claimedBy", as: "claimer" });

// Story relations
Story.belongsTo(MerchantProfile, { as: "merchant", foreignKey: "merchantId" });
MerchantProfile.hasMany(Story, { as: "stories", foreignKey: "merchantId" });

module.exports = {
  User,
  Address,
  OrderItem,
  MerchantProfile,
  Product,
  MerchentStore,
  ProductDailyStat,
  Review,
  Story,
  Category,
  SubCategory,
  GiftCard,
  AppSetting,
  Notification,
  Offer,
  SubAdminPermission,
  HomeCache,
  AdminHistory,
};
