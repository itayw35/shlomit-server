const userController = require("../DL/controllers/userController");
const jwtfb = require("../middleware/jwt");

async function makeUser(user) {
  const { userName, password } = user;
  if (!userName || !password) {
    throw { code: 400, message: "missing details" };
  }
  const myUser = await userController.read({ userName: userName });
  if (myUser.length < 1) {
    userController.create(user);
  } else {
    throw ({ code: 400 }, { message: "this user already exists" });
  }
  const token = jwtfb.createToken(user._id);
  return token;
}
async function login(user) {
  const { userName, password } = user;
  if (!userName || !password) throw { code: 400, message: "missing details" };
  const myUser = await userController.read({ userName: userName }, "+password");
  if (myUser.length < 1) throw { code: 400, message: "user does not exist" };
  if (myUser[0].password !== password) {
    throw { code: 400, message: "wrong password" };
  }
  const token = jwtfb.createToken(myUser[0]._id);

  return {
    code: 200,
    message: myUser[0].fname,
    token: token,
  };
}
async function findUser(id) {
  const user = id
    ? await userController.readOne(id)
    : await userController.read({});
  if (!user) {
    throw { code: 400, message: "user is not found" };
  }
  return user;
}
async function putUser(id, data) {
  const user = await userController.readOne(id);
  if (!user) throw { code: 404, message: "user is not found" };
  userController.update({ _id: id }, data);
  return true;
}
async function findAdmin(id) {
  const user = await userController.read({ _id: id });
  if (user[0].permission === "admin") {
    return true;
  }

  return false;
}

module.exports = { makeUser, findUser, putUser, login, findAdmin };
