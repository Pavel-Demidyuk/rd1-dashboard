let mousetimeout;
let screensaver_active = false;
let idletime = 5;

function show_screensaver() {
    console.log('starting screensaver')
    $('#screensaver').fadeIn();
    screensaver_active = true;
    screensaver_animation();
}

function stop_screensaver() {
    $('#screensaver').stop();
    $('#screensaver').fadeOut();
    screensaver_active = false;
}

$(document).mousemove(function () {
    clearTimeout(mousetimeout);

    if (screensaver_active) {
        stop_screensaver();
    }

    mousetimeout = setTimeout(function () {
        show_screensaver()
    }, 1000 * idletime);
});

$(document).ready(() => {
    show_screensaver()
})

let getRandomPosition = () => {
    return Math.floor(Math.random() * 110) + '%'
}

function screensaver_animation() {
    if (screensaver_active) {
        // $('#screensaver').show();
        $('#screensaver').animate(
            {
                'background-position-x': getRandomPosition(),
                'background-position-y': getRandomPosition()
            },
            10000,
            screensaver_animation);
    }
}
