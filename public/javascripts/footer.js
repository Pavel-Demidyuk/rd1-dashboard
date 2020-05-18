const FIND_LINK = "/find"

$(document).ready(() => {
    $("#footer").click(() => {
        window.location.href = "/"
    })
    updateIp()
    setTimeout(update, 5000)
})


let updateTime = () => {
    $('#time').html('')
    let date = new Date();
    $('#time').html(date.getHours() + ':' + date.getMinutes())
}

let updateCpu = () => {
    $.get('cpu', result => {
        $('#cpu').html(result.cpu)
    }).fail(function () {
        console.log('error')
    })
}

let updateIp = () => {
    $.get('ip', result => {
        $('#ip').html(result.ip)
    }).fail(function () {
        console.log('error')
    })
}

let update = () => {
    updateTime()
    updateCpu()
    setTimeout(update, 10000)
}

