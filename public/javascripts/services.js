let updateStatusHandler = () => {
    let enableButtons = _ => {
        $('#find').html('Поиск устройств')
        $('#cleanup').html('Очистить все&nbsp;сохраненные')
        $('#find').prop('disabled', false);
        $('#cleanup').prop('disabled', false);

    }

    let disableButtons = _ => {
        $('#find').html('Подождите, идет загрузка...')
        $('#cleanup').html('Подождите, идет загрузка...')
        $('#find').prop('disabled', true);
        $('#cleanup').prop('disabled', true);
    }

    $.get('/status_json', result => {
        result = JSON.parse(result)
        $('tbody#services').html('')
        let allGreen = false
        result.containers.forEach(container => {
            if (container.name.includes('rd1-app') && container.status === 'green') {
                allGreen = true
            }
            $('tbody#services').append(`<tr><td class="${container.status}">${container.name}</td><td class="${container.status}">${container.state}</td></td></tr>`)
        })

        if (allGreen) {
           enableButtons()
        } else {
            disableButtons()
        }
    }).fail(function () {
        console.log('error')
    })

    setTimeout(updateStatusHandler, 20000)
}


$('#refresh').click(_ => {
    console.log("Reloading the page")
    location.reload();
})

setTimeout(updateStatusHandler, 5000)
