let mousetimeout;
let screensaver_active = false;
let idletime = 1;

function show_screensaver() {
    $('#screensaver').fadeIn();
    screensaver_active = true;
    screensaver_animation();
}

function stop_screensaver() {
    $('#screensaver').stop();
    $('#screensaver').fadeOut();
    screensaver_active = false;
}

function getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

$(document).mousemove(function () {
    clearTimeout(mousetimeout);

    if (screensaver_active) {
        stop_screensaver();
    }

    mousetimeout = setTimeout(function () {

    }, 1000 * idletime); // 5 secs
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
            5000,
            screensaver_animation);
    }
}
