$(document).ready(() => {
    setTimeout(updateAll, 5000)

    updateIp(); // do it just once
})

let updateTime = () => {
    $.get('time', result => {
        result = JSON.parse(result)
        $('#time').html(result.time)
    }).fail(function () {
        console.log('error')
    })
}

let updateCpu = () => {
    $.get('cpu', result => {
        // result = JSON.parse(result)
        $('#cpu').html(result.cpu)
    }).fail(function () {
        console.log('error')
    })
}

let updateIp = () => {
    $.get('ip', result => {
        result = JSON.parse(result)
        $('#ip').html(result.ip)
    }).fail(function () {
        console.log('error')
    })
}

let updateHealth = () => {
    $.get('health', result => {
        result = JSON.parse(result)
        $('#health').html('Health: ' + result.status +
            '<br/> Registered devices: ' + result.devicesCount)
    }).fail(function () {
        console.log('error')
    })
}

let updateAll = () => {
    console.log("Footer updateAll...")
    updateTime()
    updateCpu()
    updateHealth()
    setTimeout(updateAll, 10000)
}

