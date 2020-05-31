let updateStatusHandler = () => {
    console.log("Updating statuses")
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
            $('#find').prop('disabled', false);
            $('#cleanup').prop('disabled', false);
        } else {
            $('#find').prop('disabled', true);
            $('#cleanup').prop('disabled', true);
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
