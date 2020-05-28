$(document).ready(() => {
    setTimeout(updateAll, 5000)

    updateIp();
    updateSpace();
    updatePublicIp();
})

let updateTime = () => {
    $.get('time', result => {
        result = JSON.parse(result)
        $('#time').html(result.time)
    }).fail(function () {
        console.log('error')
    })
}

let updateSpace = () => {
    $.get('space', result => {
        $('#space').html(result)
    }).fail(function () {
        console.log('error')
    })
    setTimeout(updateSpace, 3600000)
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

    setTimeout(updateIp, 3600000)
}

let updatePublicIp = () => {
    $.get('public_ip', result => {
        result = JSON.parse(result)
        $('#public_ip').html(result.ip)
    }).fail(function () {
        console.log('error')
    })

    setTimeout(updatePublicIp, 3600000)
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

