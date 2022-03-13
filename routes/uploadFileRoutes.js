const express = require("express");
const { uploadFile } = require("../controllers/uploadFileControllers");

const router = express.Router();

router.post("/upload-file", uploadFile);

module.exports = router;
