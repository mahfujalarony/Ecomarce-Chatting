const router = require("express").Router();
const subCategoryController = require("../controllers/subCategoryController");
const protect = require("../middleware/Middleware");
const requireAdminOrSubAdminPermission = require("../middleware/requireAdminOrSubAdminPermission");


router.post("/", protect, requireAdminOrSubAdminPermission("manage_catagory"), subCategoryController.createSubCategory);
router.get("/", subCategoryController.getSubCategories);
router.patch("/:id", protect, requireAdminOrSubAdminPermission("manage_catagory"), subCategoryController.updateSubCategory);
router.delete("/:id", protect, requireAdminOrSubAdminPermission("manage_catagory"), subCategoryController.deleteSubCategory);

module.exports = router;
