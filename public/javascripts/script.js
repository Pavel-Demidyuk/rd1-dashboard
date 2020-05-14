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

    saveDevicesHandler()

    // $("#repeat_find").click(() => {
    //     startLoading()
    // })
    // $("#main_page_button").click(() => {
    //     $("#loading").hide()
    //     $("#loading_fail").hide()
    //     $("#main_page").show()
    // })
})

let saveDevicesHandler = () => {
    $('[data-card="0"]').show();

    $('button#toggle').click(e => {
        e.preventDefault();
        let btn = $(e.target)
        let id = btn.data('id')
        $.get('/raw/3A/toggle/' + id, result => {
            console.log(result)
        }).fail(function () {
            console.log('error')
        })
    })

    $('button#save').click(e => {
        e.preventDefault();
        let btn = $(e.target)
        let id = btn.data('id')
        let index = btn.closest('.card').data('card')
        let service = btn.data('service')
        // let name = $('input[name=name_' + id + ']').val()
        $.get('http://127.0.0.1:5051/raw/1wire/register/?id=' + id + '&service=' + service + '&name=' + id, result => {
            console.log(result)
            $('#card_' + id).hide()
            let nextIndex = index + 1
            if ($('[data-card="' + nextIndex + '"]').length) {
                $('[data-card="' + nextIndex + '"]').show();
            } else {
                window.location.href = "/"
            }
        }).fail(function () {
            console.log('error')
        })
    })
}

// let startLoading = () => {
//     $("#main_page").hide()
//     $("#loading").show()
//     $.get("/find")
//         .done(data => {
//             console.log(data)
//             data.forEach(device => {
//                 renderDevice(device)
//             })
//         })
//         .fail(() => {
//             console.log('!!!!fail')
//             $("#loading").hide()
//             $("#loading_fail").show()
//         })
// }

// let renderDevice = (device) => {
//
// }
