const FIND_LINK = "/find"

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
    setTimeout(updateStatusHandler, 5000)
})




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

    setTimeout(updateStatusHandler, 10000)
}

