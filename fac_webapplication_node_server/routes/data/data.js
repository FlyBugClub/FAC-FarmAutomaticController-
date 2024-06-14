const router = require("express").Router();
const data = require("./dataprocess");


router.get("/getDashboard/:id", async (req, res) => {
  let result = await data.getDashboard(req.params.id);
  res.json(result);
});


module.exports = router;
