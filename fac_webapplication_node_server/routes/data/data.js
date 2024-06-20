const router = require("express").Router();
const data = require("./dataprocess");


router.get("/getDashboard/:id", async (req, res) => {
  let result = await data.getDashboard(req.params.id);
  res.json(result);
});

router.get("/getequipment/:id/:idequipment", async (req, res) => {
  let result = await data.getEspInfo(req.params.id,req.params.idequipment);
  res.json(result);
});



module.exports = router;
