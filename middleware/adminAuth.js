const userLogic = require("../BL/userLogic");
const adminAuth = async (req, res, next) => {
  try {
    const isAdmin = await userLogic.findAdmin(req._id);
    if (!isAdmin)
      throw { code: 403, message: "only admin can watch this page" };
    next();
  } catch (err) {
    res.status(err.code).send(err.message);
  }
};
module.exports = adminAuth;
