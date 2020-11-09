var express = require("express");
var router = express.Router();
var StatisticsResourceController = require("../controllers/StatisticsResourceController");
const verifyToken = require("../middlewares/auth.js").verifyToken;
const grant_access = require("../middlewares/auth.js").grant_access;

router.get("/api/resources/statistics-description", StatisticsResourceController.getStatisticsResourceByFields);
router.get("/api/resources/statistics-description/:id", StatisticsResourceController.getStatisticsResourceById);
router.post("/api/resources/statistics-description",verifyToken,grant_access('create', 'statistics_description'), StatisticsResourceController.postStatisticsResource);
router.patch("/api/resources/statistics-description/:id",verifyToken,grant_access('updateAny', 'statistics_description'), StatisticsResourceController.updateStatisticsResource);
router.delete("/api/resources/statistics-description/:id",verifyToken,grant_access('deleteAny', 'statistics_description'), StatisticsResourceController.deleteStatisticsResource);
module.exports = router;