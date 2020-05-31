$(document).ready(() => {
    $(function () {
        $("#tabs").tabs();
    });
})

let LOCAL_IP = '127.0.0.1'
let LOCAL_URL = 'http://' + LOCAL_IP + ':3000'

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
        // position: {my: "right-100 top-250"},
        buttons: [{
            text: "Закрыть",
            click: function () {
                $(this).dialog("close");
            }
        }]
    });
}
