const router = require("express").Router();
const auth = require("./authprocess");

router.post("/request-otp", async (req, res) => {
  let result = await auth.requestOTP(req.body.email);
  res.json(result);
});


router.get("/getUser/:id", async (req, res) => {
  let result = await auth.getUser(req.params.id);
  res.json(result);
});

router.post("/getUser", async (req, res) => {
  let result = await auth.getUser(req.body.username, req.body.password);
  res.json(result);
});

router.post("/createUser", async (req, res) => {
  let result = await auth.createUser(req.body);
  res.json(result);
});

module.exports = router;