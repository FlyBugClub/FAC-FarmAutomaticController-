const router = require("express").Router();
const data = require("./dataprocess");
router.get("/TestAPI", async (req, res) => {
  let result = await data.TestAPI();
  res.json(result);
});

module.exports = router;
