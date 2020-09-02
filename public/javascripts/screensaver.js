let mousetimeout;
let screensaver_active = false;
let disableScreensaver = false
const IDLETIME_MINUNTES = 10;

function show_screensaver() {
    if (disableScreensaver) {
        return;
    }
    $('#screensaver').fadeIn();
    screensaver_active = true;
    screensaver_animation();
}

function stop_screensaver() {
    $('#screensaver').stop();
    $('#screensaver').fadeOut();
    screensaver_active = false;
}

$(document).mousemove(_ => {
    clearTimeout(mousetimeout);

    if (screensaver_active) {
        stop_screensaver();
    }

    mousetimeout = setTimeout(_ => {
        show_screensaver()
    }, 1000 * 60 * IDLETIME_MINUNTES);
});

$(document).ready(_ => {
    show_screensaver();
    setTimeout(_ => {
        stop_screensaver()
    }, 3001)

    mousetimeout = setTimeout(_ => {
        show_screensaver()
    }, 1000 * IDLETIME_MINUNTES);
})

let getRandomPosition = _ => {
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
