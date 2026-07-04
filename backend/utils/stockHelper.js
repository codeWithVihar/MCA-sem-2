const sendLowStockEmail = require("./emailService");

const updateStockStatus = async (product, forceAlert = false) => {
  const previousStatus = product.stockStatus;

  if (product.currentStock === 0) {
    product.stockStatus = "OUT_OF_STOCK";
  } else if (product.currentStock <= product.minStockLevel) {
    product.stockStatus = "LOW_STOCK";
  } else {
    product.stockStatus = "IN_STOCK";
  }

  if (product.stockStatus !== "IN_STOCK") {
    if (forceAlert || previousStatus !== product.stockStatus) {
      await sendLowStockEmail(product);
    }
  }
};

module.exports = updateStockStatus;
