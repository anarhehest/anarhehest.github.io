random_color = () => '#' + (Math.floor(Math.random() * 0xFFFFFF).toString(16)).padStart(6, '0');

$(document).ready(function () {
  var colorLoop = function () {
    var frame = $(".rcg"); // for Random Color Generator

    function shiftColor() {
      const color = random_color();
      const seconds = 2 + Math.pow(Math.PI, Math.random());

      frame.css({
        "background-color": color,
        "box-shadow": `0 0 256px 100px ${color}`,
        transition: `background-color ${seconds}s ease-in-out, box-shadow ${seconds}s ease-in-out`,
      });

      setTimeout(shiftColor, seconds * 10 ** 3);
    }
    shiftColor();
  };
  colorLoop();
});
