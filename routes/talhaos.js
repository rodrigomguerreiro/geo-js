const express = require('express');

const { getTalhaos, addTalhao } = require('../controllers/talhaos');

const router = express.Router();

router
    .route('/')
    .get(getTalhaos)
    .post(addTalhao);

module.exports = router;