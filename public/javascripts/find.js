const TOGGLE_URL = 'http://127.0.0.1:5051/raw/3A/toggle/',
    SAVE_URL = 'http://127.0.0.1:5051/raw/1wire/register/?id=',
    FIND_URL = 'http://127.0.0.1:5051/find?json=true'

$(document).ready(() => {
    $("#cleanup").click(_ => {
        $("#dialog_cleanup_confirm").dialog({
            buttons: [{
                text: "Да, продолжить",
                click: () => {
                    cleanup();
                    $("#dialog_cleanup_confirm").dialog("close");
                }
            },
                {
                    text: "Отмена",
                    click: function () {
                        $(this).dialog("close");
                    }
                }]
        })
    })

    let cleanup = () => {
        $('#loading').hide()
        $('#find_tab').hide()
        $('#cleanup_info').show();
        $.get('/cleanup')
            .done(_ => {
                $('#cleanup_info').hide();
                $('#find_tab').show();
                info('Удаление завершено. Система в процессе запуска. ' +
                    'Состояние системы можно посмотреть во вкладке "Сервисы"')
            })
            .fail(_ => {
                $('#cleanup_info').hide();
                $('#find_tab').show();
                error('Ошибка перезагрузки системы.')
            })
    }

    $("#find").click(() => {
        foundDevices = []
        $("#find_tab").hide()
        $("#loading").show()
        $.get(FIND_URL)
            .done(devices => {
                $("#loading").hide()
                $("#find_tab").show()
                if (devices.devices.length) {
                    foundDevices = devices.devices
                    totalFound = devices.totalSavedCount
                    showDeviceDialog(0)
                } else {
                    info('Новые устройства не найдены. ' +
                        '<br> Всего проверено устройств <b>' + devices.totalRawCount + '</b>' +
                        '<br> Ранее сохраненные: <b>' + devices.totalSavedCount + '</b>'
                    )
                }
            })
            .fail(err => {
                $("#loading").hide()
                $("#find_tab").show()
                error('Ошибка при загрузке новых устройств, попробуйте снова или свяжитесь с поддержкой.')
            })
    })
})

let showDeviceDialog = index => {
    $("#dialog_device_context").html(' ' + (index + 1) + ' из ' + foundDevices.length)
    $("#dialog_device").dialog({
        // position: {my: "right-100 top-250"},
        buttons: [
            {
                text: "ВКЛ",
                click: function () {
                    toggle(foundDevices[index].uuid)
                }
            }, {
                text: "Розетка",
                click: function () {
                    $(this).dialog("close");
                    save(index, 'Outlet')
                }
            }, {
                text: "Свет",
                click: function () {
                    $(this).dialog("close");
                    save(index, 'Lightbulb')
                }
            }
        ]
    });
}

let toggle = id => {
    $.get(TOGGLE_URL + id, result => {
        // console.log(result)
    }).fail(err => {
        console.log(err)
        error('Ошибка переключения устройства')
    })
}

let save = (index, type) => {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: SAVE_URL + foundDevices[index].uuid + '&service=' + type + '&name=' + (totalSavedCount + index + 1),
        success: _ => {
            $("#dialog_device").dialog("destroy");
            if (foundDevices[index + 1]) {
                showDeviceDialog(index + 1)
            }
        },
        error: err => {
            error('Ошибка сохранения устройства')
        }
    })
}
