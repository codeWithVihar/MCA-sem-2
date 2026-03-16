const Supplier = require("../models/Supplier");

/* CREATE SUPPLIER */
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);

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

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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