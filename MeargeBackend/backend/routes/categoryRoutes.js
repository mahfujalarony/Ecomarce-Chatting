const router = require("express").Router();
const c = require("../controllers/categoryController");
const protect = require("../middleware/Middleware");
const requireAdminOrSubAdminPermission = require("../middleware/requireAdminOrSubAdminPermission");

router.get("/", c.getCategories);
router.get("/ecom", (req, res, next) => {
  req.query.format = "ecom";
  return c.getCategories(req, res, next);
});
router.post("/", protect, requireAdminOrSubAdminPermission("manage_catagory"), c.createCategory);
router.put("/:id", protect, requireAdminOrSubAdminPermission("manage_catagory"), c.updateCategory);
router.delete("/:id", protect, requireAdminOrSubAdminPermission("manage_catagory"), c.deleteCategory);

module.exports = router;
