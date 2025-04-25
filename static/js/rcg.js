l = {
  "random": {
    "color": () => '#' + (Math.floor(Math.random() * 0x01000000).toString(0x10)).padStart(6, '0'),
    "seconds": () => Math.PI + Math.pow(Math.PI, Math.random()),
  }
}

$(document).ready(function (frame) {
  var colorLoop = function (frame) {
    function shiftColor() {
      const color = l.random.color();
      const shadow = window.innerHeight * 1 / 3;
      const time = l.random.seconds();

      frame.css({
        "background-color": color,
        "box-shadow": `0 -${window.innerHeight}px ${shadow * 0x1000}px ${shadow}px ${color}`,
        "transition": `background-color ${time}s ease-in-out, box-shadow ${time}s ease-in-out`,
      });

      setTimeout(shiftColor, time * 10 ** 3);
    };

    shiftColor();
  };

  var frame = $(".rcg");
  frame.css({
    "width": "100%",
    'height': "100%",
    "position": "absolute",
    "bottom": "0%",
    "left": "0%",
  })

  colorLoop(frame);
});
