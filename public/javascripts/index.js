const FIND_LINK = "/find?json=true"

$(document).ready(() => {
    $("#find").click(() => {
        $("#find").hide()
        $("#loading").show()
        window.location.href = FIND_LINK
    })

    $("#repeat_find").click(() => {
        window.location.href = FIND_LINK
    })

    $("#cleanup").dblclick(() => {
        console.log("Cleanup")
        $.get('/cleanup')
            .done(_ => {
                alert('done')
            })
            .fail(_ => {
                alert('error')
            })
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
        let allGreen = true
        result.containers.forEach(container => {
            if (container.status === 'red') {
                console.log("!!!!!!!", container)
                allGreen = false
            }
            $('tbody').prepend(`<tr><td>${container.name}</td><td>${container.state}<span class='state ${container.status}'>&#9733;</span></td></td></tr>`)
        })

        if (allGreen) {
            console.log('showing....')
            $('#find').prop('disabled', false);
        } else {
            console.log('disabling button')
            $('#find').prop('disabled', true);
        }
    }).fail(function () {
        console.log('error')
    })

    setTimeout(updateStatusHandler, 10000)
}

