const router = require("express").Router();
const data = require("./dataprocess");
router.get("/TestAPI", async (req, res) => {
  let result = await data.TestAPI('240420032518');
  res.json(result);
});

module.exports = router;
