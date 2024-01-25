const appointmentController = require("../DL/controllers/appointmentController");
async function getAllAppointments() {
  const today = new Date();
  const appointments = await appointmentController.read(
    {
      time: { $gt: today },
    },
    "time"
  );
  if (appointments.length === 0)
    throw { code: 400, message: "there are no appointments set" };
  return { code: 200, message: appointments };
}
async function getAllAppointmentsWithInfo() {
  const today = new Date();
  const appointments = await appointmentController.read({
    time: { $gt: today },
  });
  if (appointments.length === 0)
    throw { code: 400, message: "there are no appointments set" };
  return { code: 200, message: appointments };
}
async function setAppointment(data) {
  const { name, phone, date } = data;
  if (!name || !phone || !date) throw { code: 400, message: "missing details" };
  const isOccupied = await appointmentController.readOne({ time: date });
  if (isOccupied) throw { code: 400, message: "מצטערים, התור תפוס" };
  const formattedDate = new Date(date);
  const timestamp = new Date(
    Date.UTC(
      formattedDate.getFullYear(),
      formattedDate.getMonth(),
      formattedDate.getDate(),
      formattedDate.getHours(),
      formattedDate.getMinutes(),
      formattedDate.getSeconds(),
      formattedDate.getMilliseconds()
    )
  );
  appointmentController.create({
    patientName: name,
    phoneNumber: phone,
    time: timestamp,
  });
  return {
    code: 200,
    message: `התור נקבע בהצלחה לתאריך ${date.slice(
      0,
      10
    )} בשעה ${formattedDate.getHours() + 2}:${formattedDate.getMinutes()}0
  `,
  };
}
module.exports = {
  getAllAppointments,
  setAppointment,
  getAllAppointmentsWithInfo,
};
