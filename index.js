require("dotenv").config();

const express = require("express"),
  app = express(),
  PORT = process.env.PORT;
app.use(require("cors")());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   res.header(
//     "Access-Control-Allow-Headers",
//     " Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(express.json());
app.use("/appointments", require("./Routes/appointmentRouter"));
app.use("/users", require("./Routes/userRouter"));
app.listen(PORT, () => console.log("connection succeeded!"));
require("./DL/db").myConnect();
