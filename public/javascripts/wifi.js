const REFRESH_STATUS_INTERVAL = 3000
let Keyboard = window.SimpleKeyboard.default;

let myKeyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    layout: {
        'default': [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            'q w e r t y u i o p [ ] \\',
            'a s d f g h j k l ; \'',
            '{shift} z x c v b n m , . /',
            '{space} @'
        ],
        'shift': [
            '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
            'Q W E R T Y U I O P { } |',
            'A S D F G H J K L : "',
            '{shift} Z X C V B N M < > ?',
            '@ {space}'
        ]
    }
});

let updateStatus = _ => {
    $.get('http://localhost/wifi/status').done(data => {
        if (data.status === 'ok') {
            setStatusGreen(data)
        } else {
            setStatusAmber(data)
        }
    })
    setTimeout(updateStatus, REFRESH_STATUS_INTERVAL)
}

setTimeout(updateStatus, REFRESH_STATUS_INTERVAL)

let setStatusGreen = data => {
    //signal_wifi_4_bar
    $('i.wifi_signal').html('signal_wifi_4_bar')
    $('i.wifi_signal').removeClass('warning')
    $("#current_network").html(data.currentNetwork)
    $("#internet_connection").html(data.internetConnection)
}

let setStatusAmber = data => {
    $('i.wifi_signal').html('signal_wifi_off')
    $('i.wifi_signal').addClass('warning')
}

let closePass = _ => {
    $('.wifipass').hide();
}

let refreshWifiList = callback => {
    $.get('http://localhost/wifi/list')
        .done(data => {
            $('.wifi_list').html("")
            data.list.forEach(net => {
                $('.wifi_list').append('<li>' + net)
            })

            if (callback) {
                callback()
            }
        })
}


function onChange(input) {
    document.querySelector(".wifi").value = input;
    console.log("Input changed", input);
}

function onKeyPress(button) {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
}

function handleShift() {
    let currentLayout = myKeyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    myKeyboard.setOptions({
        layoutName: shiftToggle
    });
}

$(document).ready(() => {
    // wifi_list
    refreshWifiList();


    $('.wifi.close').click(_ => {
        closePass()
    })

    $('.wifi.save').click(_ => {
        $('button.wifi.close').attr('value', 'Сохраняем...')
        $.post('/wifi/save', {
            net: $('input.wifi_net').val(),
            pass: $('input.wifi').val()
        }).done(_ => {
            $('button.wifi.close').attr('value', 'Закрыть')
            refreshWifiList(_ => {
                closePass();
            })
        }).fail(e => {
            console.log('Error while saving wifi, ', e)
        })
    })


    $('.wifi_list').on('click', 'li', (e => {
        let net = $(e.target).text()
        showPasswordDialog(net)
    }))

    $('#refresh_wifi').click(_ => {
        refreshWifiList()
    })
})

let showPasswordDialog = net => {
    $('button.wifi.close').attr('value', 'Закрыть')
    $('.wifi_net').val(net)
    $('.wifi').val('')
    $('.wifipass').show()
}
