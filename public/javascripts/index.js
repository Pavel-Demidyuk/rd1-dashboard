const FIND_LINK = "/find"

$(document).ready(() => {
    $(function () {
        $("#tabs").tabs();
    });

    $("#cleanup").dblclick(() => {
        console.log("Cleanup")
        $.get('/cleanup')
            .done(_ => {
                info('Очистка завершена. Система перезагружается, это может занять несколько минут.')
            })
            .fail(_ => {
                error('Ошибка перезагрузки системы.')
            })
    })
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
                console.log("!!!!!!!", container)
                allGreen = false
            }
            $('tbody#services').prepend(`<tr><td>${container.name}</td><td>${container.state}<span class='state ${container.status}'>&#9733;</span></td></td></tr>`)
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

