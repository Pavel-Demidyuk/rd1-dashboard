var express = require('express');
var router = express.Router();
var http = require('http');
const {exec} = require('child_process'),
    FIND_URL = '/find?json=true'

/* GET home page. */
router.get('/', function (req, res, next) {
    getServicesStatuses()
        .then(result => {
        res.render('index', {
            title: 'RD1 Dashboard',
            containers: result
        });
    }).catch(_ => {
        res.render('index', {
            title: 'RD1 Dashboard',
            containers: ['error', 'error']
        });
    })
});

    router.get('/cleanup', function (req, res, next) {
        exec('rm -rf /root/rd1/configs/homebridge/accessories && rm -rf /root/rd1/configs/homebridge/persist && ' +
            ' cd /root/rd1 && boot/bash/update.sh && boot/bash/reboot.sh', (err, stdout, stderr) => {
            res.send(JSON.stringify({
                done: true
            }));
        })
    });

    router.get('/ip', function (req, res, next) {
        getIp().then(result => {
            res.send(JSON.stringify({
                ip: result
            }));
        })
    });

    router.get('/time', function (req, res, next) {
        getTime().then(result => {
            res.send(JSON.stringify({
                time: result
            }));
        })
    });

    router.get('/status_json', function (req, res, next) {
        getServicesStatuses().then(containers => {
            res.send(JSON.stringify({
                containers: containers
            }));
        })
            .catch(_ => {
            res.send(JSON.stringify({
                containers: [{name: 'error', status: 'error'}]
            }));
        })
    });

    router.get('/cpu', function (req, res, next) {
        exec('vcgencmd measure_temp', (err, stdout, stderr) => {
            res.send({
                cpu: stdout
            });
        })
    });

    let getIp = () => {
        return new Promise(resolve => {
            exec('hostname -I', (err, stdout, stderr) => {
                if (err) {
                    resolve('undefined on mac')
                } else {
                    resolve(stdout)
                }
            });
        })
    }

    let getTime = () => {
        return new Promise(resolve => {
            exec('date', (err, stdout, stderr) => {
                if (err) {
                    resolve('undefined on mac')
                } else {
                    resolve(stdout)
                }
            });
        })
    }

    let getServicesStatuses = () => {
        let parseColorStatus = (state) => {
            if (state.toLowerCase().includes('unhealthy') || state.toLowerCase().includes('exit') || state.toLowerCase().includes('dead')) {
                return 'red'
            }
            if (state.toLowerCase().includes('healthy')) {
                return 'green'
            }
            return 'yellow'
        }

        return new Promise((resolve, reject) => {
            exec('docker container ls -a --format \'{{.Image}}***{{.Status}}\'', (err, stdout, stderr) => {
                let result = []
                if (err) {
                    console.error(err)
                    reject(err)
                } else {
                    stdout.split(/\r?\n/).forEach(status => {
                        if (status.length === 0) {
                            return
                        }
                        let [name, state] = status.split("***")
                        result.push({
                            name: name,
                            state: state,
                            status: parseColorStatus(state)
                        })
                    })

                    resolve(result.sort((a, b) => {
                        return a.name > b.name
                    }))
                }
            });
        })
    }
//
// /* GET home page. */
// router.get('/find', function (req, res, next) {
//     let options = {
//         // host: 'http://127.0.0.1:5051' + FIND_URL
//         path: FIND_URL,
//         port: 5051
//     }
//     let request = http.request(options, function (result) {
//         let data = '';
//         result.on('data', function (chunk) {
//             data += chunk;
//         });
//         result.on('end', function () {
//             console.log('!!!', data)
//             data = JSON.parse(data)
//             res.render('devices', {
//                 devices: data.devices,
//                 length: data.devices.length
//             });
//         });
//     });
//     request.on('error', function (e) {
//         console.log(e.message);
//     });
//     request.end();
// });
    module.exports = router;
