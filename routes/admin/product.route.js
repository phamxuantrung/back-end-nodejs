const express = require("express")
const multer  = require('multer')
const router = express.Router();
const productController = require("../../controllers/admin/product.controller.js")

const storage = require("../../helper/uploadFile.js")
const upload = multer({ storage: storage })

router.get("/", productController.index);
router.patch("/change-status", productController.changeStatus)
router.patch("/change-multi-status", productController.changeMultiStatus)
router.delete("/remove-product", productController.removeProduct)
router.delete("/remove-multi-product", productController.removeMultiProduct)
router.patch("/undo-remove-product", productController.undoRemoveProduct)
router.get("/create", productController.createProductView)
router.post("/create", upload.single('thumbnail'), productController.createProduct)
router.get("/update/:id", productController.updateProductView)
router.patch("/update/:id", upload.single('thumbnail'), productController.updateProduct)
router.get("/:id", productController.detailProduct)
module.exports = router