const express = require("express");
const router = express.Router();

const {
  createOrder,
  getPendingOrders,
  confirmOrder,
  rejectOrder,
  dispatchOrder,
  completeOrder,
  getCustomerOrders
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { getAllOrders } = require("../controllers/orderController");
/* CUSTOMER */
router.post("/", createOrder);



/* ADMIN */
router.get("/pending", protect, authorize("Admin", "Manager"), getPendingOrders);

// router.post("/:id/confirm", protect, authorize("Admin", "Manager"), confirmOrder);

router.post("/:id/reject", protect, authorize("Admin", "Manager"), rejectOrder);

router.post("/:id/dispatch", protect, authorize("Admin", "Manager"), dispatchOrder);

router.post("/:id/complete", protect, authorize("Admin", "Manager"), completeOrder);

router.get("/", protect, authorize("Admin", "Manager"), getAllOrders);

router.get("/customer/:phone", getCustomerOrders);

module.exports = router;