function startGradientAnimationSmooth($el, options) {
    if (!$el.length) return;

    var opts = $.extend({
        // Основное сглаживание текущих значений к цели (0.02 - очень плавно, 0.1 - живо)
        lerpFactor: 0.05,
        // Амплитуда случайного дрейфа цели за кадр
        driftAngle: 0.3,   // градусов
        driftH: 0.6,       // тон
        driftS: 0.3,       // насыщенность (%)
        driftL: 0.2,       // яркость (%)
        textMode: false,
        glow: false,
        glowSize: 30,
        glowColor: null,
        glowSource: 'colorA',
        cover: false,
        coverAttach: 'fixed'
    }, options);

    // Текущие отображаемые параметры
    var angle = Math.random() * 360;
    var colorA = { h: Math.random() * 360, s: 60 + Math.random() * 40, l: 50 + Math.random() * 20 };
    var colorB = { h: Math.random() * 360, s: 60 + Math.random() * 40, l: 50 + Math.random() * 20 };

    // Целевые параметры (начально совпадают с текущими)
    var targetAngle = angle;
    var targetColorA = { h: colorA.h, s: colorA.s, l: colorA.l };
    var targetColorB = { h: colorB.h, s: colorB.s, l: colorB.l };

    // Разово настраиваем cover
    if (opts.cover) {
        $el.css({
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-attachment': opts.coverAttach
        });
        if ($el.is('body')) {
            $('html, body').css('height', '100%');
            $('body').css('margin', '0');
        }
    }

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        var a = s * Math.min(l, 1 - l);
        var f = function (n) {
            var k = (n + h / 30) % 12;
            var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return '#' + f(0) + f(8) + f(4);
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function update() {
        // 1. Цель непрерывно дрейфует (маленькие случайные шаги)
        targetAngle += (Math.random() - 0.5) * opts.driftAngle;
        targetColorA.h += (Math.random() - 0.5) * opts.driftH;
        targetColorA.s += (Math.random() - 0.5) * opts.driftS;
        targetColorA.l += (Math.random() - 0.5) * opts.driftL;
        targetColorB.h += (Math.random() - 0.5) * opts.driftH;
        targetColorB.s += (Math.random() - 0.5) * opts.driftS;
        targetColorB.l += (Math.random() - 0.5) * opts.driftL;

        // Корректировка диапазонов цели
        targetAngle %= 360;
        targetColorA.h = ((targetColorA.h % 360) + 360) % 360;
        targetColorA.s = Math.min(100, Math.max(0, targetColorA.s));
        targetColorA.l = Math.min(100, Math.max(0, targetColorA.l));
        targetColorB.h = ((targetColorB.h % 360) + 360) % 360;
        targetColorB.s = Math.min(100, Math.max(0, targetColorB.s));
        targetColorB.l = Math.min(100, Math.max(0, targetColorB.l));

        // 2. Плавно приближаем отображаемые параметры к дрейфующей цели
        angle = lerp(angle, targetAngle, opts.lerpFactor);
        colorA.h = lerp(colorA.h, targetColorA.h, opts.lerpFactor);
        colorA.s = lerp(colorA.s, targetColorA.s, opts.lerpFactor);
        colorA.l = lerp(colorA.l, targetColorA.l, opts.lerpFactor);
        colorB.h = lerp(colorB.h, targetColorB.h, opts.lerpFactor);
        colorB.s = lerp(colorB.s, targetColorB.s, opts.lerpFactor);
        colorB.l = lerp(colorB.l, targetColorB.l, opts.lerpFactor);

        var hexA = hslToHex(colorA.h, colorA.s, colorA.l);
        var hexB = hslToHex(colorB.h, colorB.s, colorB.l);
        var gradient = 'linear-gradient(' + angle + 'deg, ' + hexA + ', ' + hexB + ')';

        var css = { 'background-image': gradient };
        if (opts.textMode) {
            css['background-clip'] = 'text';
            css['-webkit-background-clip'] = 'text';
            css['color'] = 'transparent';
        }

        if (opts.glow) {
            var glowHex;
            if (opts.glowColor) {
                glowHex = opts.glowColor;
            } else {
                if (opts.glowSource === 'colorB') glowHex = hexB;
                else if (opts.glowSource === 'mix') {
                    var r = (parseInt(hexA.slice(1,3), 16) + parseInt(hexB.slice(1,3), 16)) >> 1;
                    var g = (parseInt(hexA.slice(3,5), 16) + parseInt(hexB.slice(3,5), 16)) >> 1;
                    var b = (parseInt(hexA.slice(5,7), 16) + parseInt(hexB.slice(5,7), 16)) >> 1;
                    glowHex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                } else {
                    glowHex = hexA;
                }
            }
            css[opts.textMode ? 'text-shadow' : 'box-shadow'] = '0 0 ' + opts.glowSize + 'px ' + glowHex;
        }

        $el.css(css);
        requestAnimationFrame(update);
    }

    update();
}