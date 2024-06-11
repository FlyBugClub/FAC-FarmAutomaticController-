const router = require("express").Router();
const data = require("./dataprocess");
router.get("/getUser/:id", async (req, res) => {
  let result = await data.getUser(req.params.id);
  res.json(result);
});

router.post("/getUser", async (req, res) => {
  let result = await data.getUser(req.body.id);
  res.json(result);
});

module.exports = router;
