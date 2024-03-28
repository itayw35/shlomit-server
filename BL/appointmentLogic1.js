const appointmentController = require("../DL/controllers/appointmentController");
const axios = require("axios");
const AWS = require("aws-sdk");
async function getAllAppointments() {
  const today = new Date();
  const appointments = await appointmentController.read(
    {
      time: { $gt: today },
    },
    "time status"
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
  sendSMS(process.env.MY_PHONE_NUMBER, `${name} מעוניינ/ת לקבוע תור ב${date}`);
  return {
    code: 200,
    message: `התור שקבעת לתאריך ${date.slice(0, 10)} בשעה ${
      formattedDate.getHours() + 2
    }:${formattedDate.getMinutes()}0 ממתין לאישור. נודיע לך כשהוא יאושר. יום טוב :-)
      `,
  };
}
async function updateAppointment(data) {
  const { id, status } = data;
  const appointment = await appointmentController.readOne({ _id: id });
  if (!appointment) throw { code: 400, message: "appointment is not found" };
  await appointmentController.update({ _id: id }, { $set: { status: status } });
  return { code: 200, message: `appointment ${status}` };
}
async function sendEmail(recieverMail, mailSubject, mailText) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_SENDER_USER_NAME,
      password: process.env.MAIL_SENDER_PASSWORD,
    },
  });
  let mailOptions = {
    from: `"Admin" ${process.env.MAIL_SENDER_USER_NAME}`,
    to: recieverMail,
    subject: mailSubject,
    text: mailText,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}
async function sendSMS(phoneNumber, message) {
  AWS.config.update({ region: "il-central-1" });
  const credentials = new AWS.Credentials({
    accessKeyId: process.env.SNS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SNS_ACCESS_KEY,
  });
  AWS.config.credentials = credentials;
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };
  const sns = new AWS.SNS({ apiVersion: "2010-03-31" });
  sns.publish(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("success", data);
    }
  });
  //   const url = "https://textbelt.com/text";
  // const params = new URLSearchParams();
  // params.append("phone", phoneNumber);
  // params.append("message", message);
  // params.append("key", "textbelt");
  // try {
  //   const response = await axios.post(url, params);
  //   console.log(response.data);
  // } catch (err) {
  //   console.error("Error sending sms: ", err);
  // }
}
module.exports = {
  getAllAppointments,
  setAppointment,
  getAllAppointmentsWithInfo,
  updateAppointment,
};
