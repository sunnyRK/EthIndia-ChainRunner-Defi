const express = require('express');
const router = express.Router();
const models = require('../models/models');

router.post('/createTrade', function(req, res, next) {
    models.create(req.body).then(function(trade) {
        res.send(trade)
    }).catch(next);
});

router.get('/getAllTrades', async (req, res) => {
    try {
        var result = await models.find().exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;