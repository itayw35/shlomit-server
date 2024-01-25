const appointmentModel = require("../models/appointment");

const create = async function (obj) {
  const res = await appointmentModel.appointmentModel.create(obj);
  return res;
};
const read = async function (query, proj) {
  const res = await appointmentModel.appointmentModel.find(query, proj);
  return res;
};
const readOne = async function (query) {
  const res = await appointmentModel.appointmentModel.findOne(query);
  return res;
};
const update = async function (query, data) {
  const res = await appointmentModel.appointmentModel.updateOne(query, data);
  return res;
};
const del = async function (query) {
  const res = await appointmentModel.appointmentModel.updateMany(query, {
    isActive: false,
  });
  return res;
};

module.exports = { create, read, update, del, readOne };
