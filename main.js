window.onload = function() {

  /**************************************************
   * Global Variables                               *
   **************************************************/

  var width = $(document).width(),
    height = $(document).height();

  var colors = ['#33104a', '#4b186c', '#63218f', '#8f3192', '#c0458a', '#e8608a', '#ef9198', '#f8c1a8'];

  var saccadeColor = '#F6004F',
    regressionColor = '#00FFFF',
    fixationColor = '#666';

  var paused = false,
    finished = false,
    started = false;

  var debugEnabled = true;

  var timelineOffset = 30,
    densityOffset = -30;

  var svg = d3.select('#animationCanvas').append('svg').attr('width', width).attr('height', height),
    densityGroup = svg.append('g').attr('id', 'densityGroup'),
    timelineGroup = svg.append('g').attr('id', 'timelineGroup'),
    playBackGroup = svg.append('g').attr('id', 'playBackGroup'),
    playBackLineGroup = svg.append('g').attr('id', 'playBackLineGroup'),
    playBackCircleGroup = svg.append('g').attr('id', 'playBackCircleGroup');

  var playBackAnimationEnabled = true,
    timelineAnimationEnabled = true,
    densityAnimationEnabled = true;

  // TODO data calibration nasıl yapılmalı.

  /**************************************************
   * Animation Stuff                                *
   **************************************************/
   
   // Calibrate data
   (function() {
     data.trials.forEach(function(trial) {
       trial.forEach(function(movement) {
         if (movement.type === 'fixation') {
           movement.x += data.xFix;
           movement.y += data.yFix;
         } else if (movement.type === 'saccade') {
           movement.x1 += data.xFix;
           movement.x2 += data.xFix;
           movement.y += data.yFix;
         }
       })
     })
   })();

  function reset() {
    // FIXME remove çalışmıyor.
    playBackGroup.remove();
    playBackGroup = svg.append('g').attr('id', 'playBackGroup');
    playBackLineGroup = svg.append('g').attr('id', 'playBackLineGroup');
    playBackCircleGroup = svg.append('g').attr('id', 'playBackCircleGroup');

    timelineOffset = 30;
    densityOffset = -30;
  }

  function debug(funcName) {
    if (debugEnabled) {
      console.log(performance.now() + funcName);
    }
  }

  function startAnimation() {
    started = true;
    finished = false;

    // TODO update controls

    // Read position of text from data.
    $('.read-text').css({top: data.sentenceY, left: data.sentenceX}).fadeIn(function() {
      drawTrials(0);
    });
  }

  function endAnimation() {
    finished = true;
    started = false;
    // TODO update controls
  }

  function drawTrials(i) {
    debug('drawTrials');
    // TODO update message.
    return drawMovements(data.trials[i], i, 0, function() {
      if (i + 1 < data.trials.length) {
        setTimeout(function() {
          // Clean playback area.
          reset();
          // Call next trial.
          setTimeout(function() {
            drawTrials(i + 1);
          }, 1000);
        }, 4000);
      } else {
        endAnimation();
      }
    });
  }

  function drawMovements(trial, i, j, callback) {
    debug('drawMovements');
    return animateAll(trial[j], function() {
      if (j + 1 < trial.length) {
        drawMovements(trial, i, j + 1, callback);
      } else {
        callback();
      }
    });
  }

  function drawLine(obj) {
    return obj.group.append('path')
      .attr('d', obj.path)
      .attr('stroke', obj.color)
      .attr('stroke-width', '1')
      .attr('fill', 'none');
  }

  function drawCircle(obj) {
    return obj.group.append('circle')
      .attr('cx', obj.x)
      .attr('cy', obj.y)
      .attr('r', 0)
      .attr('fill', obj.color)
      .attr('opacity', .6);
  }

  function drawRectangle(obj) {
    return obj.group.append('rect')
      .attr('x', obj.x)
      .attr('y', obj.y)
      .attr('width', obj.width)
      .attr('height', 0)
      .attr('fill', obj.color)
      .attr('opacity', .1);
  }

  function animateLine(obj, callback) {
    var path = drawLine(obj),
      totalLength = path.node().getTotalLength();
    return path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(obj.duration)
      .attr('stroke-dashoffset', 0)
      .on('end', callback);
  }

  function animateCircle(obj, callback) {
    return drawCircle(obj)
      .transition()
      .duration(obj.duration)
      .attr('r', obj.r)
      .on('end', callback);
  }

  function animateRectangle(obj, callback) {
    return drawRectangle(obj)
      .transition()
      .duration(obj.duration)
      .attr('y', obj.y - obj.duration / 5)
      .attr('height', obj.duration / 5)
      .on('end', callback);
  }

  function animateAll(movement, callback) {
    playBackAnimation(movement);
    timelineAnimation(movement);
    densityAnimation(movement);
    setTimeout(callback, movement.duration);
  }

  /**
   *
   */
  function playBackAnimation(movement, callback) {
    function getSaccadeData() {
      return {
        group: playBackLineGroup,
        path: 'M ' + movement.x1 + ' ' + movement.y + ' Q ' + (movement.x1 + (movement.x2 - movement.x1) / 2) + ' ' + (movement.y - 30) + ' ' + movement.x2 + ' ' + movement.y,
        color: movement.x2 - movement.x1 < 0 ? regressionColor : saccadeColor,
        duration: movement.duration
      }
    }

    function getFixationData() {
      return {
        group: playBackCircleGroup,
        x: movement.x,
        y: movement.y,
        r: movement.duration / 30,
        duration: movement.duration
      }
    }

    if (playBackAnimationEnabled) {
      if (movement.type === 'saccade') {
        return animateLine(getSaccadeData(movement), callback);
      } else if (movement.type === 'fixation') {
        return animateCircle(getFixationData(movement), callback);
      }
      return;
    }
  }

  /**
   *
   */
  function timelineAnimation(movement, callback) {
    function getSaccadeData() {
      return {
        group: timelineGroup,
        path: 'M ' + movement.x1 + ' ' + (movement.y + timelineOffset) + ' H ' + movement.x2,
        color: movement.x2 - movement.x1 < 0 ? regressionColor : saccadeColor,
        duration: movement.duration
      }
    }

    function getFixationData() {
      var tOffset = timelineOffset;
      timelineOffset += movement.duration / 10;
      return {
        group: timelineGroup,
        path: 'M ' + movement.x + ' ' + (movement.y + tOffset) + ' V ' + (movement.y + timelineOffset),
        color: fixationColor,
        duration: movement.duration
      }
    }

    if (timelineAnimationEnabled) {
      if (movement.type === 'saccade') {
        // draw horizontal line
        return animateLine(getSaccadeData(movement), callback);
      } else if (movement.type === 'fixation') {
        // draw vertical line
        return animateLine(getFixationData(movement), callback);
      }
      return;
    }
  }

  /**
   *
   */
  function densityAnimation(movement, callback) {
    function getFixationData(movement) {
      return {
        group: densityGroup,
        x: (movement.x - 5),
        y: (movement.y + densityOffset),
        width: 10,
        height: movement.duration / 5,
        color: fixationColor,
        duration: movement.duration
      }
    }

    if (densityAnimationEnabled) {
      if (movement.type === 'fixation') {
        // draw rectangle
        return animateRectangle(getFixationData(movement), callback);
      }
      return;
    }
  }

  /**************************************************
   * UI Bindings                                    *
   **************************************************/

  // Init tooltip
  $(function() {
    $('[data-toggle="tooltip"]').tooltip()
  })

  /* Start Animation */
  $('#demo').click(function() {
    $('#projectInfo').fadeOut(function() {
      $('#animationCanvas').fadeIn(function() {
        startAnimation();
      });
    });
  });

  /* Back */
  $('#back').click(function() {
    // TODO Stop animation.
    // TODO Clear all svg.
    // TODO Remove #demo from url.
    $('#animationCanvas').fadeOut(function() {
      $('#projectInfo').fadeIn();
    });
  });

  /* Resume */
  $('#resume').click(function() {
    // TODO Resume animation.
  });

  /* Pause */
  $('#pause').click(function() {
    // TODO Pause animation.
  });

  /* Stop */
  $('#stop').click(function() {
    // TODO Stop animation.
  });

  /* Restart */
  $('#restart').click(function() {
    // TODO Restart animation.
  });

}
