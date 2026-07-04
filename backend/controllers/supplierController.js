const Supplier = require("../models/Supplier");

/* CREATE SUPPLIER */
exports.createSupplier = async (req, res) => {
  try {
    const data = {
      supplierName: req.body.supplierName || req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      contactPerson: req.body.contactPerson,
      productsSupplied: req.body.productsSupplied,
      rating: req.body.rating,
      deliveryTimeDays: req.body.deliveryTimeDays,
      status: req.body.status
    };

    const supplier = await Supplier.create(data);

    res.status(201).json({
      success: true,
      data: supplier
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL SUPPLIERS */
exports.getSuppliers = async (req, res) => {
  try {

    const suppliers = await Supplier.find();

    res.json({
      count: suppliers.length,
      data: suppliers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE SUPPLIER */
exports.updateSupplier = async (req, res) => {
  try {
    const data = {
      supplierName: req.body.supplierName || req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      contactPerson: req.body.contactPerson,
      rating: req.body.rating,
      deliveryTimeDays: req.body.deliveryTimeDays,
      status: req.body.status
    };

    // Remove undefined keys
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    res.json(supplier);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE SUPPLIER */
exports.deleteSupplier = async (req, res) => {
  try {

    await Supplier.findByIdAndDelete(req.params.id);

    res.json({ message: "Supplier deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};