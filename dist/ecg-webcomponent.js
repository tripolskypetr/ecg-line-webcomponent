var ecg;
(function (ecg) {
    var HEIGHT = 125;
    var WIDTH = 275;
    var INTERVAL = 30;
    var CURVE_COLOR = "#22ff22";
    var heartData = [0, 0, 0, 0, 0];
    var heartDataIndex = 0;
    var beatDataIndex = -1;
    var BANG = false;
    function fillHeartData(length) {
        if (length !== heartData.length) {
            heartData = new Array(length);
            for (var i = 0; i < length; i++) {
                heartData[i] = 0;
            }
        }
    }
    function fillBeatData() {
        var getValue = function (idx) { return idx === 0 ? Math.random() * 0.1 + 0.1
            : idx === 1 ? Math.random() * 0.1 + 0.0
                : idx === 2 ? Math.random() * 0.3 + 0.7
                    : idx === 3 ? Math.random() * 0.1 - 0.05
                        : idx === 4 ? Math.random() * 0.3 - 0.8
                            : idx === 5 ? Math.random() * 0.1 - 0.05
                                : idx === 6 ? Math.random() * 0.1 - 0.05
                                    : idx === 7 ? Math.random() * 0.1 + 0.15
                                        : 0; };
        heartData[heartDataIndex] = getValue(beatDataIndex);
        beatDataIndex++;
        if (beatDataIndex > 7) {
            beatDataIndex = -1;
        }
    }
    function fillRandomData() {
        heartData[heartDataIndex] = Math.random() * 0.05 - 0.025;
    }
    function updateData() {
        heartDataIndex++;
        if (heartDataIndex >= heartData.length) {
            heartDataIndex = 0;
        }
        else {
            heartDataIndex++;
        }
        if (beatDataIndex >= 0 || BANG) {
            fillBeatData();
            BANG = false;
        }
        else {
            fillRandomData();
        }
    }
    function ellipse(ctx, x, y, a, b) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.scale(a / b, 1);
        ctx.arc(0, 0, b, 0, Math.PI * 2, true);
        ctx.restore();
        ctx.closePath();
    }
    function EcgLine() {
        var _a;
        var self = Reflect.construct(HTMLElement, [], EcgLine);
        var height = self.hasAttribute('height') ? self.getAttribute('height') : HEIGHT;
        var width = self.hasAttribute('width') ? self.getAttribute('width') : WIDTH;
        var canvas = document.createElement('canvas');
        _a = [height, width], canvas.height = _a[0], canvas.width = _a[1];
        var context = canvas.getContext('2d');
        var onPaint = function () {
            context.clearRect(0, 0, width, height);
            var baseY = height / 2;
            var length = heartData.length;
            var step = (width - 5) / length;
            var yFactor = height * 0.35;
            var heartIndex = (heartDataIndex + 1) % length;
            context.strokeStyle = CURVE_COLOR;
            context.beginPath();
            context.moveTo(0, baseY);
            var i = 0, x = 0, y = 0;
            for (i = 0; i < length; i++) {
                x = i * step;
                y = baseY - heartData[heartIndex] * yFactor;
                context.lineTo(x, y);
                heartIndex = (heartIndex + 1) % length;
            }
            context.stroke();
            context.closePath();
            context.beginPath();
            context.fillStyle = CURVE_COLOR;
            ellipse(context, x - 1, y - 1, 2, 2);
            context.fill();
            context.closePath();
        };
        var interval = setInterval(function () {
            if (document.contains(canvas)) {
                updateData();
                onPaint();
            }
            else {
                clearInterval(interval);
            }
        }, INTERVAL);
        fillHeartData(Math.max(100, Math.floor(width * 0.5)));
        self.appendChild(canvas);
        return self;
    }
    window['ecgLine'] = function (callback) { return callback(function () { return BANG = true; }); };
    EcgLine.prototype = Object.create(HTMLElement.prototype);
    customElements.define('ecg-line', EcgLine);
})(ecg || (ecg = {})); // namespace ecg
