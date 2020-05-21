const TOGGLE_URL = 'http://127.0.0.1:5051/raw/3A/toggle/',
    SAVE_URL = 'http://127.0.0.1:5051/raw/1wire/register/?id='

$(document).ready(() => {
    $("#cleanup").dblclick(() => {
        info('Запущено удаление устройств, это может занять несколько минут. ' +
            'После завершения удаления, система будет перезагружена автоматически.')

        $.get('/cleanup')
            .done(_ => {
                info('Удаление завершено. Система в процессе запуска. ' +
                    'Состояние системы можно посмотреть во вкладке "Сервисы"')
            })
            .fail(_ => {
                error('Ошибка перезагрузки системы.')
            })
    })

    $("#find").click(() => {
        foundDevices = []
        $("#find_tab").hide()
        $("#loading").show()
        $.get('http://127.0.0.1:5051/find?json=true')
            .done(devices => {
                $("#loading").hide()
                $("#find_tab").show()
                if (devices.devices.length) {
                    foundDevices = devices.devices
                    showDeviceDialog(0)
                } else {
                    info('Поиск завершен. Устройства не найдены.')
                }
            })
            .fail(err => {
                $("#loading").hide()
                error('Ошибка при загрузке новых устройств, попробуйте снова или свяжитесь с поддержкой.')
            })
    })
})

let showDeviceDialog = index => {
    $("#dialog_device_context").html(' ' + index + 1 + ' из ' + foundDevices.length)
    $("#dialog_device").dialog({
        position: {my: "right-100 top-250"},
        buttons: [
            {
                text: "ВКЛ",
                click: function () {
                    toggle(foundDevices[index].uuid)
                }
            }, {
                text: "Розетка",
                click: function () {
                    save(index, 'Outlet')
                }
            }, {
                text: "Свет",
                click: function () {
                    save(index, 'Switch')
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
        url: SAVE_URL + foundDevices[index].uuid + '&service=' + type + '&name=' + index + 1,
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
