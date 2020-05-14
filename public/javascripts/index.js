$(document).ready(() => {
    $("#find").click(() => {
        $("#find").hide()
        $("#loading").show()
        window.location.href = "/find"
    })

    $("#repeat_find").click(() => {
        window.location.href = "/find"
    })

    $("#main_page_button").click(() => {
        window.location.href = "/"
    })
    updateTime()
    setTimeout(updateStatusHandler, 30000)
})

let updateTime = () => {
    $('#time').html('')
    let date = new Date();
    $('#time').html(date.getHours() + ':' + date.getMinutes())
}

let updateStatusHandler = () => {
    console.log("Updating statuses")
    $.get('status_json', result => {
        result = JSON.parse(result)
        $('tbody').html('')
        result.containers.forEach(container => {
            $('tbody').prepend(`<tr><td>${container.name}</td><td>${container.state}</td></tr>`)
        })
    }).fail(function () {
        console.log('error')
    })

    updateTime()
    setTimeout(updateStatusHandler, 60000)
}

