var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/* GET home page. */
router.get('/find', function (req, res, next) {
    let devices = [
        {
            name: 123,
            family: '1wire/3A',
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            switchFullPath: '/some/path/switch',
            sensorFullPath: '/some/path/sensor',
            sensorValue: 1,
        },
        {
            name: 123,
            family: '1wire/3A',
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            switchFullPath: '/some/path/switch',
            sensorFullPath: '/some/path/sensor',
            sensorValue: 1,
        }
    ]

    res.render('devices', {
        devices: devices,
        length: devices.length
    });
});
module.exports = router;
