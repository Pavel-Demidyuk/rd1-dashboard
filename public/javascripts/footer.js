
$(document).ready(() => {
    $("#footer").click(() => {
        window.location.href = "/"
    })
    updateIp(); // do it just once
    setTimeout(update, 5000)
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
        result = JSON.parse(result)
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

let update = () => {
    console.log("Footer update...")
    updateTime()
    updateCpu()
    setTimeout(update, 10000)
}

