var express = require('express');
var router = express.Router();
var http = require('http');
const {exec} = require('child_process'),
    FIND_URL = '/find/json'

/* GET home page. */
router.get('/', function (req, res, next) {
    Promise.all([getSystemHealthData(), getIp()]).then(result => {
        res.render('index', {
            title: 'RD1 Dashboard',
            containers: result[0],
            ip: result[1]
        });
    })
});


router.get('/status_json', function (req, res, next) {
    getSystemHealthData().then(containers => {
        res.send(JSON.stringify({
            containers: containers
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

let getSystemHealthData = () => {
    let parseColorStatus = (state) => {
        if (state.toLowerCase().includes('unhealthy') || state.toLowerCase().includes('exit')|| state.toLowerCase().includes('dead')) {
            return 'red'
        }
        if (state.toLowerCase().includes('healthy')) {
            return 'green'
        }
        return 'yellow'
    }

    return new Promise(resolve => {
        exec('docker container ls -a --format \'{{.Image}}***{{.Status}}\'', (err, stdout, stderr) => {
            let result = []
            if (err) {
                console.error(err)
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

/* GET home page. */
router.get('/find', function (req, res, next) {
    let options = {
        // host: 'http://127.0.0.1:5051' + FIND_URL
        path: FIND_URL,
        port: 5051
    }
    let request = http.request(options, function (res) {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            res.render('devices', {
                devices: data.devices,
                length: data.length
            });
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();
});
module.exports = router;
