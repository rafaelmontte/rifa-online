const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({ user: String, password: String, role: String });

module.exports = mongoose.model("Admin", AdminSchema);