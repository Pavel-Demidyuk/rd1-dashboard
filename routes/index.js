var express = require('express');
var router = express.Router();
var http = require('http');
const {exec} = require('child_process'),
    FIND_URL = '/find?json=true',
    HEALTH_URL = '/health'

/* GET home page. */
router.get('/', (req, res, next) => {
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

router.get('/cleanup', (req, res, next) => {
    exec('cd /root/rd1 && boot/bash/services/rd1_stop.sh && sleep 5 && boot/bash/cleanup.sh && boot/bash/update.sh && boot/bash/services/rd1_run.sh', (err, stdout, stderr) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send(JSON.stringify({
            done: true
        }));
    })
});

router.get('/ip', (req, res, next) => {
    getIp().then(result => {
        res.send(JSON.stringify({
            ip: result
        }));
    })
});

router.get('/public_ip', (req, res, next) => {
    getPublicIp().then(result => {
        res.send(JSON.stringify({
            ip: result
        }));
    })
});

router.get('/time', (req, res, next) => {
    getTime().then(result => {
        res.send(JSON.stringify({
            time: result
        }));
    })
});

router.get('/health', (req, res, next) => {
    getHealth().then(result => {
        res.send(result);
    })
});

router.get('/reboot', (req, res, next) => {
    exec('shutdown -r now', (err, stdout, stderr) => {
        res.send({
            reboot: 'started'
        });
    })
});

router.get('/status_json', (req, res, next) => {
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

router.get('/cpu', (req, res, next) => {
    exec('vcgencmd measure_temp', (err, stdout, stderr) => {
        res.send({
            cpu: stdout
        });
    })
});

router.get('/space', (req, res, next) => {
    exec("df -hl / | awk 'NR == 2{print $5+0}'", (err, stdout, stderr) => {
        res.send(stdout + '%');
    })
});

router.get('/wifi/list', (req, res) => {
    exec("sudo iwlist wlan0 scan|grep SSID", (err, stdout, stderr) => {
        // res.send(stdout + '%');
        let networks = stdout.split("\n").map(line =>
            line.trim()
                .replace(/\"/g, '')
                .replace(/ESSID:/g, '')

        ).filter(line => line != null)

        res.send({list: networks})
    })
    // res.send({
    //     list: [
    //         1, 2, 3, 45, 'test', 'adfjlkajldkasjdlkas',
    //         1, 2, 3, 45, 'test', 'adfjlkajldkasjdlkas',
    //         1, 2, 3, 45, 'test', 'adfjlkajldkasjdlkas',
    //     ]
    // });
});

router.get('/wifi/status', (_, res) => {
    // @TODO add wifi logic

    // data.currentNetwork)
    // $("#internet_connection").html(data.internetConnection)
    res.send({
        status: 'ok',
        currentNetwork: 'abracadabra',
        internetConnection: 'да'
    })
})

router.post('/wifi/save', (req, res) => {
    console.log("!!!!", req.body.net, req.body.pass)
    res.send({
        done: true
    })
})

let getIp = () => {
    return new Promise(resolve => {
        exec('hostname -I', (err, stdout, stderr) => {
            if (err) {
                resolve('127.0.0.1')
            } else {
                resolve(stdout)
            }
        });
    })
}

let getPublicIp = () => {
    return new Promise(resolve => {
        exec('curl icanhazip.com', (err, stdout, stderr) => {
            if (err) {
                resolve('error')
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

let getHealth = () => {
    return new Promise((resolve, reject) => {
        let options = {
            // host: 'http://127.0.0.1:5051' + FIND_URL
            path: HEALTH_URL,
            port: 5051,
            timeout: 5000
        }


        let request = http.request(options, function (result) {
            let data = '';
            result.on('data', function (chunk) {
                data += chunk;
            });
            result.on('end', function () {
                // data = JSON.parse(data)
                resolve(data)
            });
        });
        request.on('error', function (e) {
            reject('Health getting error!')
        });
        request.end();
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
        exec("docker container ls -a --format '{{.Names}}***{{.Status}}'", (err, stdout, stderr) => {
            let result = []
            if (err) {
                console.error(err)
                reject('Services status error!' + err)
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
module.exports = router;
