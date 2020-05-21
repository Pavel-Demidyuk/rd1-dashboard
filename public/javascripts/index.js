const FIND_LINK = "/find"

$(document).ready(() => {
    $(function () {
        $("#tabs").tabs();
    });

    setTimeout(updateStatusHandler, 5000)
})

let error = message => {
    $("#dialog_error").html(message)
    $("#dialog_error").dialog({
        position: {my: "right-100 top-250"},
        buttons: [{
            text: "Закрыть",
            click: function () {
                $(this).dialog("close");
            }
        }]
    });
}

let info = message => {
    $("#dialog_info").html(message)
    $("#dialog_info").dialog({
        position: {my: "right-100 top-250"},
        buttons: [{
            text: "Закрыть",
            click: function () {
                $(this).dialog("close");
            }
        }]
    });
}

let updateStatusHandler = () => {
    console.log("Updating statuses")
    $.get('status_json', result => {
        result = JSON.parse(result)
        $('tbody#services').html('')
        let allGreen = true
        result.containers.forEach(container => {
            if (container.status === 'red') {
                allGreen = false
            }
            $('tbody#services').append(`<tr><td class="${container.status}">${container.name}</td><td class="${container.status}">${container.state}</td></td></tr>`)
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

