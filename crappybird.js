var g = {
  framerate: 30,
  gameSpeed: 250
};

function game() {
  if (g.loops) {
    Object.getOwnPropertyNames(g.loops).forEach(function(loop) {clearTimeout(g.loops[loop]);});
  }

  init();
  clear();



  g.s = g.gameSpeed / g.framerate;
  g.walls = [Wall()];
  var crap = Crap();
  var score = Score();

  g.loops = {
    gameloop: setInterval(function() {


      // check if the game is over
      var w = g.walls[0];
      if (crap.y > g.h || crap.y < -20 ||
        (w.x >= crap.x0 && w.x <= crap.x1 && !w.inGap(crap.y))) {
        game();
      }

      clear();

      crap.update(score.score);
      crap.draw();

      score.draw();

      for (var i = g.walls.length - 1; i >= 0; i--) {
        g.walls[i].update();
        if (g.walls[i].x < 20) {
          g.walls.splice(i, 1);
          score.point();
        } else {
          g.walls[i].draw();
        }
      }

    }, 1000 / g.framerate),

    spawnWalls: setInterval(function() {
      g.walls.push(Wall(g.ctx));
    }, 1000)
  };

  // spawn new walls


  // check for jump input
  document.onkeydown = function(e) {
    if (e.keyCode === 32) {
      crap.jump();
    }
  }

}

function init() {
  var canvas = document.getElementById('crappy');
  g.ctx = canvas.getContext('2d');
  g.h = canvas.height;
  g.w = canvas.width;
}

function clear() {
  g.ctx.clearRect(0,0, g.w,g.h);
}

function Wall() {

  var wallWidth = 10,
      gapSize = g.h/4.5,
      gapBuffer = 50,
      gapTop = randInt(gapBuffer, g.h - gapSize - gapBuffer),
      gapBot = gapTop + gapSize,
      lowerWallSize = g.h - gapTop - gapSize,
      x0 = g.w;

  var wallColor = 'black';

  return {
    x: x0,
    update: function() {
      this.x -= g.s;
    },
    draw: function() {
      g.ctx.fillStyle = wallColor;
      g.ctx.fillRect(this.x, 0, wallWidth, gapTop);
      g.ctx.fillRect(this.x, gapBot, wallWidth, lowerWallSize);
    },
    inGap: function(y) {
      return gapTop <= y && y <= gapBot;
    }
  };
}

function Crap() {

  var crapStyle = 'red',
      s = 10;

  var x = 40,
      y = 20,
      v = 0,
      grav = 1,
      vJump = -13;

  return {
    x0: x - s,
    x1: x + s,
    y: y,
    v: v,
    update: function(score) {
      this.y += this.v;
      this.v += grav + (score ? score : 0) * .025;
    },
    draw: function() {
      g.ctx.fillStyle = crapStyle;
      g.ctx.fillRect(x, this.y, s, s);
    },
    jump: function() {
      this.v = vJump;
    }
  }
}

function Score() {

  var scoreStyle = 'blue',
      scoreFont = '14px Arial';

  return {
    score: 0,
    point: function() { this.score++; },
    draw: function() {
      g.ctx.fillStyle = scoreStyle;
      g.ctx.font = scoreFont;
      g.ctx.fillText(this.score.toString(), 20, 20);
    }
  }
}

function randInt(min, max) {
  return Math.ceil(Math.floor(Math.random() * (max - min)) + min);
}


game();
