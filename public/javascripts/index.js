$(document).ready(() => {
    $(function () {
        $("#tabs").tabs();
    });
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
        // position: {my: "right-100 top-250"},
        buttons: [{
            text: "Закрыть",
            click: function () {
                $(this).dialog("close");
            }
        }]
    });
}

