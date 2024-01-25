const userModel = require("../models/user");

const create = async function (obj) {
  const res = await userModel.userModel.create(obj);
  return res;
};
const read = async function (query, proj) {
  const res = await userModel.userModel.find(query, proj);
  return res;
};
const readOne = async function (id) {
  const res = await userModel.userModel.findById(id);
  return res;
};
const update = async function (query, data) {
  const res = await userModel.userModel.updateOne(query, data);
  return res;
};
const del = async function (query) {
  const res = await update(query, { isActive: false });
  return res;
};

module.exports = { create, read, update, del, readOne };
