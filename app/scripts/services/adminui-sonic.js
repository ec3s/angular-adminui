(function(Sonic) {
  function sonicService() {
    var width = $(window).width();
    var Tween = {
      Cubic: {
        easeOut: function(t, b, c, d) {
          return c * ((t = t / d - 1) * t * t + 1) + b;
        }
      }
    };
    var getOffsetX = function(index, startX, width) {
      var offset = (index - 3) * 10;
      return Tween.Cubic.easeOut(
        startX - offset, 0 - offset, (width / 2) - offset, width * 0.2
      );
    };
    var loader = {
      width: width,
      height: 5,
      fillColor: '#1196EE',
      trailLength: 0.01,
      pointDistance: 0.01,
      fps: 30,
      step: function(point, index, frame) {
        var ctx = this._;
        ctx.fillText(0 | frame * this.fps, 1, 99);
        ctx.beginPath();
        for (var i = 4; i >= 0; i--) {
          var offset = getOffsetX(i, point.x, loader.width);
          ctx.moveTo(offset, point.y);
          ctx.rect(offset, point.y, 3, 3);
        }
        ctx.closePath();
        ctx.fill();
      },
      path: [
        ['line', 0, 0, width, 0]
      ]
    };
    var sonic = new Sonic(loader);
    return function(dom) {
      dom.append(sonic.canvas);
      sonic.play();
      return sonic;
    }
  }
  angular.module('ntd.services').factory('sonic', [sonicService]);
})(Sonic);
