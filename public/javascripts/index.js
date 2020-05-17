const FIND_LINK = "http://127.0.0.1:5000/find"

$(document).ready(() => {
    $("#find").click(() => {
        $("#find").hide()
        $("#loading").show()
        window.location.href = FIND_LINK
    })

    $("#repeat_find").click(() => {
        window.location.href = FIND_LINK
    })

    $("#main_page_button").click(() => {
        window.location.href = "/"
    })
    updateTime()
    setTimeout(updateStatusHandler, 5000)
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

let updateStatusHandler = () => {
    console.log("Updating statuses")
    $.get('status_json', result => {
        result = JSON.parse(result)
        $('tbody').html('')
        result.containers.forEach(container => {
            $('tbody').prepend(`<tr><td>${container.name}</td><td>${container.state}<span class='state ${container.status}'>&#9733;</span></td></td></tr>`)
        })
    }).fail(function () {
        console.log('error')
    })

    updateTime()
    updateCpu()
    setTimeout(updateStatusHandler, 10000)
}

