const express = require("express");
const empRouter = express.Router();
const { EmpModel } = require("../models/employee.model");
require("dotenv").config();

empRouter.post("/employees", async (req, res) => {
  const payload = req.body;
  try {
    const empExists = await EmpModel.findOne({ Email: payload.Email });
    if (empExists)
      return res.json({ message: "Employee with email already exists" });

    const emp = new EmpModel(payload);
    await emp.save();
    return res.status(200).json({ message: "Employee added" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
});

empRouter.get("/employees/get", async (req, res) => {
  const { filter, sort } = req.query;
  let employees;
  try {
    if (filter && sort)
      employees = await EmpModel.find({ Department: filter }).sort({
        Salary: sort,
      });
    else if (filter) employees = await EmpModel.find({ Department: filter });
    else if (sort) employees = await EmpModel.find().sort({ Salary: sort });
    else employees = await EmpModel.find();

    if (!employees[0]) return res.json({ message: "Employees not exists" });
    return res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
});

empRouter.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await EmpModel.findOne({ _id: id });
    if (!employee) return res.json({ message: "Employee not exists" });
    await EmpModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Successfully Deleted", employee: employee });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
});

empRouter.patch("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const employee = await EmpModel.findOne({ _id: id });
    if (!employee) return res.json({ message: "Employee not exists" });
    await EmpModel.findByIdAndUpdate(id, payload);
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
});

module.exports = { empRouter };
