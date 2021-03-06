const HEALTH_URL = 'health'

$(document).ready(() => {
    setTimeout(updateAll, 5000)
    updateIp();
    updateSpace();
    updatePublicIp();
})

let updateTime = () => {
    $.get('/time', result => {
        result = JSON.parse(result)
        $('#time').html(result.time)
    }).fail(function () {
        console.log('error')
    })
}

let updateSpace = () => {
    $.get('/space', result => {
        $('#space').html(result)
    }).fail(function () {
        console.log('error')
    })
    setTimeout(updateSpace, 3600000)
}

let updateCpu = () => {
    $.get('/cpu', result => {
        // result = JSON.parse(result)
        $('#cpu').html(result.cpu)
    }).fail(function () {
        console.log('error')
    })
}

let updateIp = () => {
    $.get('/ip', result => {
        result = JSON.parse(result)
        $('#ip').html(result.ip.split(' ')[0])
        let LOCAL_IP = result.ip.split(' ')[0]

        TOGGLE_URL = 'http://' + LOCAL_IP + ':5051' + '/raw/3A/toggle/';
        SAVE_URL = 'http://' + LOCAL_IP + ':5051' + '/raw/1wire/register/?id=',
        FIND_URL = 'http://' + LOCAL_IP + ':5051' + '/find?json=true',
        CLEANUP_URL = 'http://' + LOCAL_IP + ':3000' + '/cleanup'
    }).fail(function () {
        console.log('error')
    })

    setTimeout(updateIp, 3600000)
}

let updatePublicIp = () => {
    $.get('/public_ip', result => {
        result = JSON.parse(result)
        $('#public_ip').html(result.ip)
    }).fail(function () {
        console.log('error')
    })

    setTimeout(updatePublicIp, 3600000)
}

let updateHealth = () => {
    $.ajax({
        url: HEALTH_URL,
        success: function (result) {
            result = JSON.parse(result)
            if (result.error) {
                $('#error_state').html(result.error)
                $('#error_state').show()
            }
            else {
                $('#error_state').hide()
                $('#error_state').html('')
                $('#total_registered').html(result.devicesCount)
                $('#total_physical').html(result.physicalCount)
            }
        },
        timeout: 5000 //in milliseconds
    });
}

let updateAll = () => {
    console.log("Footer updateAll...")
    updateTime()
    updateCpu()
    updateHealth()
    setTimeout(updateAll, 20000)
}

$('#reboot_button').click(_ => {
    $("#reboot_dialog").dialog({
        buttons: [
            {
                text: "Перезагрузить",
                click: function () {
                    $('body').hide('slow')
                    $.get('/reboot', _ => {
                        $(this).dialog("close");
                    }).fail(function () {
                        $('body').show()
                        $(this).dialog("close");
                        error('Произошла ошибка. Вы можете перезагрузить устройство с помощью отключения питания.')
                    })
                }
            },{
                text: "Отмена",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
})

$('#update_button').click(_ => {
    $("#update_dialog").dialog({
        buttons: [
            {
                text: "Обновить",
                click: function () {
                    let updatingScreen = $('#updateScreen')
                    $('body').empty()
                    $('body').append(updatingScreen)
                    $('#updateScreen').show()
                    $.get('/update', _ => {
                        $(this).dialog("close");
                    }).fail( _ =>{
                        $(this).dialog("close");
                        error('Ошибка!')
                    }).done(_ => {
                        $(this).dialog("close");
                        location.reload();
                    })
                }
            },{
                text: "Отмена",
                click: _ => {
                    $(this).dialog("close");
                }
            }
        ]
    });
})




