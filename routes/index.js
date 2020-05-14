var express = require('express');
var router = express.Router();
var http = require('http');
const {exec} = require('child_process'),
    FIND_URL = '/find_json'

/* GET home page. */
router.get('/', function (req, res, next) {
    getSystemHealthData().then(containers => {
        console.log("!!!", containers)
        res.render('index', {
            title: 'RD1 Dashboard',
            containers: containers
        });
    })
});

let getSystemHealthData =  () => {
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
                        state: state
                    })
                })

                resolve(result)
            }
        });
    })
}

/* GET home page. */
router.get('/find', function (req, res, next) {
    let options = {
        host: 'http://127.0.0.1:5051',
        path: FIND_URL
    }
    let request = http.request(options, function (res) {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            res.render('devices', {
                devices: data,
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
