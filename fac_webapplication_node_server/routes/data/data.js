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

router.get("/getequipmentlist/:id", async (req, res) => {
  let result = await data.getEquipmentListById(req.params.id);
  res.json(result);
});

router.get("/getlaststatus/:id", async (req, res) => {
  let result = await data.getLastStatus(req.params.id);
  res.json(result);
});

router.get("/getschedule/:id", async (req, res) => {
  let result = await data.getSchedule(req.params.id);
  res.json(result);
});

router.post("/editlaststatus", async (req, res) => {
  
  let result = await data.editLastStatus(req.body);
  res.json(result);
});

router.post("/insertfarm", async (req, res) => {
  let result = await data.insertFarm(req.body);
  res.json(result);
});

router.post("/editfarm", async (req, res) => {
  let result = await data.editFarm(req.body);
  res.json(result);
});

router.post("/insertdevice", async (req, res) => {
  let result = await data.insertEquipment(req.body);
  res.json(result);
});
router.post("/editdevice", async (req, res) => {
  let result = await data.editEquipment(req.body);
  res.json(result);
});
module.exports = router;
