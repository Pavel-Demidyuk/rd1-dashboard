const HEALTH_URL = 'health'

$(document).ready(() => {
    setTimeout(updateAll, 5000)

    updateIp();
    updateSpace();
    updatePublicIp();
})

let updateTime = () => {
    $.get(LOCAL_URL + '/time', result => {
        result = JSON.parse(result)
        $('#time').html(result.time)
    }).fail(function () {
        console.log('error')
    })
}

let updateSpace = () => {
    $.get(LOCAL_URL + '/space', result => {
        $('#space').html(result)
    }).fail(function () {
        console.log('error')
    })
    setTimeout(updateSpace, 3600000)
}

let updateCpu = () => {
    $.get(LOCAL_URL + '/cpu', result => {
        // result = JSON.parse(result)
        $('#cpu').html(result.cpu)
    }).fail(function () {
        console.log('error')
    })
}

let updateIp = () => {
    $.get(LOCAL_URL + '/ip', result => {
        result = JSON.parse(result)
        $('#ip').html(result.ip)
        let LOCAL_IP = result.ip.split(' ')[0]

        const TOGGLE_URL = 'http://' + LOCAL_IP + ':5051' + '/raw/3A/toggle/',
            SAVE_URL = 'http://' + LOCAL_IP + ':5051' + '/raw/1wire/register/?id=',
            FIND_URL = 'http://' + LOCAL_IP + ':5051' + '/find?json=true',
            CLEANUP_URL = 'http://' + LOCAL_IP + ':3000' + '/cleanup',
            LOCAL_URL = 'http://' + LOCAL_IP + ':3000'

        console.log("!!!!!", TOGGLE_URL, SAVE_URL,  FIND_URL, CLEANUP_URL, LOCAL_URL)
    }).fail(function () {
        console.log('error')
    })

    setTimeout(updateIp, 3600000)
}

let updatePublicIp = () => {
    $.get(LOCAL_URL + '/public_ip', result => {
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
        success: function(result){
            result = JSON.parse(result)
            $('#health').html('Health: ' + result.status +
                '<br/> Registered devices: ' + result.devicesCount)
            $('#total_registered').html(result.devicesCount)
            $('#total_physical').html(result.physicalCount)
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

$('#reboot').click(_ => {
    $("#reboot_dialog").dialog({
        buttons: [
            {
                text: "Перезагрузить",
                click: function () {
                    $.get(LOCAL_URL + '/reboot', result => {
                        $(this).dialog("close");
                    }).fail(function () {
                        $(this).dialog("close");
                        erro('Произошла ошибка. Вы можете перезагрузить устройство с помощью отключения питания.')
                    })
                }
            }, {
                text: "Отмена",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
})



