
const express = require('express');
const slidesRouter = require('./slides');
const router = express.Router();

router.use('/slides', slidesRouter);

module.exports = router