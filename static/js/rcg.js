l = {
    "random": {
        "color": () => '#' + (Math.floor(Math.random() * 0xFFFFFF).toString(0x10)).padStart(6, '0'),
        "seconds": () => Math.PI + Math.pow(Math.PI, Math.random()),
    }
}

$(document).ready(function (frame) {
    var colorLoop = function (frame) {
        function shiftColor() {
            const color = l.random.color();
            const shadow = window.innerHeight / 10;
            const time = l.random.seconds();

            frame.css({
                "background-color": color,
                "box-shadow": `0px 0px ${shadow}px 0px ${color}`,
                "transition": `background-color ${time}s ease-in-out, box-shadow ${time}s ease-in-out`,
            });

            setTimeout(shiftColor, time * 10 ** 3);
        };

        shiftColor();
    };

    var frame = $(".rcg");

    colorLoop(frame);
});
