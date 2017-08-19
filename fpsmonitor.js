
var getFPS = (function() {
    var prevMs = (new Date()).getMilliseconds();
    var counter = 1;
    var fps = 0;

    return function() {
        var curMs = (new Date()).getMilliseconds();
        if (prevMs > curMs) {
            fps = counter;
            counter = 1;
        } else {
            counter += 1;
        }
        prevMs = curMs;
        return fps;
    };
}());

var monitor = document.createElement('div'),
    fpsHist = [],
    histDepth = 20,
    maxHeight = 36,
    maxFps = 60,
    counter = 0,
    colOffset = 28,
    scaleLinesNumber = 4,
    padding = 2,
    chartWidth = 100,
    colWidth = chartWidth / histDepth - 1;
monitorWidth = chartWidth + colOffset;

monitor.setAttribute('style', 'position: absolute; left: 0px; top: 0px; width: ' + monitorWidth + 'px; height: ' + (maxHeight + padding * 2) + 'px; border: solid 1px rgb(0,204,0); background: rgba(0,80,0,.9);');

for (var i = 0; i < scaleLinesNumber; i++) {
    var line = document.createElement('div');
    line.setAttribute('style', 'width: ' + (chartWidth - padding) + 'px; height: 1px; background: rgba(0,130,0,.8); position: absolute; bottom: ' + (padding + (i + .5) * maxHeight / scaleLinesNumber) + 'px; left: ' + colOffset + 'px;');
    monitor.appendChild(line);
}

var fpsLabel = document.createElement('b');
fpsLabel.innerHTML = 'FPS';
fpsLabel.setAttribute('style', 'font-family: Courier New; font-size: 12px; position: absolute; left: ' + padding + 'px; bottom: ' + padding + 'px; color: rgba(0,204,0,.8)');
monitor.appendChild(fpsLabel);

var fpsValue = document.createElement('div'),
    fpsValueWrapper = document.createElement('div');
fpsValue.innerHTML = '60';
fpsValue.setAttribute('style', 'width: ' + (colOffset - padding * 3) + 'px; text-align: center; font-weight: bold;')
fpsValueWrapper.setAttribute('style', 'font-family: Courier New; font-size: 18px; position: absolute; left: ' + padding + 'px; top: ' + padding * 2 + 'px; color: rgba(0,204,0,.8)');
fpsValueWrapper.appendChild(fpsValue);
monitor.appendChild(fpsValueWrapper);

document.body.appendChild(monitor);

function drawMonitor(history) {

    var childNodes = monitor.childNodes;

    var colWidth = 4,
        left = colOffset;

    for (var i = 0, l = history.length; i < l; i++) {
        var col = childNodes[i + 6],
            fps = history[i],
            factor = fps / maxFps;
        colHeight = parseInt(maxHeight * factor),
            intencity = 200,
            offset = parseInt(55 * (factor < .5 ? factor : Math.abs(factor - 1))),
            g = parseInt(intencity * factor) + offset,
            r = parseInt(intencity * (1 - factor)) + offset;

        color = 'rgba(' + r + ',' + g + ',0,.8)';

        if (!col) {
            col = document.createElement('div');
            monitor.appendChild(col);
        }
        col.setAttribute('style', 'width: ' + (colWidth - 1) + 'px; height: ' + colHeight + 'px; background: ' + color + '; position: absolute; bottom: ' + padding + 'px; left: ' + left + 'px;');
        left += (colWidth + 1);

        if (i === l - 1) {
            childNodes[5].lastChild.innerHTML = fps;
            childNodes[5].style.color = color;
        }
    }
}

(function loop() {
    requestAnimationFrame(function() {
        var fpsCount = getFPS();

        if (counter++ === 10) {
            fpsHist.push(fpsCount)
            drawMonitor(fpsHist.slice(-histDepth));
            counter = 0;
        }
        loop();
    });
}());
