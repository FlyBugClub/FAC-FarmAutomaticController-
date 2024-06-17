const router = require("express").Router();
const auth = require("./authprocess");
const sendmail = require("./sendmailprocess")

router.post("/request-otp", async (req, res) => {
  let result = await sendmail.requestOTP(req.body.email);
  res.json(result);
});


router.get("/getUser/:id", async (req, res) => {
  let result = await auth.getUserByID(req.params.id);
  res.json(result);
});

router.post("/checkValidUser", async (req, res) => {
  let result = await auth.checkValidUser(req.body.username, req.body.password);
  res.json(result);
});

router.post("/createUser", async (req, res) => {
  let result = await auth.createUser(req.body);
  res.json(result);
});

router.post("/editUser", async (req, res) => {
  let result = await auth.editUser(req.body);
  res.json(result);
});

router.get("/deleteUser/:name", async (req, res) => {
  let result = await auth.deleteUser(req.params.name);
  res.json(result);
});


module.exports = router;