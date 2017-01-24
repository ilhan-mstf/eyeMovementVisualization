window.onload = function() {

  /**************************************************
   * Global Variables                               *
   **************************************************/

  var width = $(document).width(),
    height = $(document).height();

  var colors = ['#3c1357', '#61208d', '#a73b8f', '#e8638b', '#f4aea3'];

  var saccadeColor = '#ff00ff',/*'#f4aea3',*/
    regressionColor = '#00ffff',/*'#f4aea3',*/
    fixationColor = '#3c1357';

  var paused = false,
    finished = false,
    started = false,
    stopped = false;

  var debugEnabled = true,
    playBackAnimationEnabled = true,
    timelineAnimationEnabled = true,
    densityAnimationEnabled = true;

  var timelineOffset = 30,
    densityOffset = -30;

  var svg,
    densityGroup,
    timelineGroup,
    playBackGroup,
    playBackLineGroup,
    playBackCircleGroup;

  function debug(funcName) {
    printLog(performance.now() + ' ' + funcName);
  }

  function printLog(msg) {
    if (debugEnabled) {
      console.log(msg);
    }
  }

  /**************************************************
   * Animation Stuff                                *
   **************************************************/

  function init() {
    timelineOffset = 30;
    densityOffset = -30;

    svg = d3.select('#animationCanvas').append('svg').attr('width', width).attr('height', height);
    densityGroup = svg.append('g').attr('id', 'densityGroup');
    timelineGroup = svg.append('g').attr('id', 'timelineGroup');
    playBackGroup = svg.append('g').attr('id', 'playBackGroup');
    playBackLineGroup = playBackGroup.append('g').attr('id', 'playBackLineGroup');
    playBackCircleGroup = playBackGroup.append('g').attr('id', 'playBackCircleGroup');

    stopped = false;
  }

  function resetForNextTrial() {
    playBackGroup.remove();
    playBackGroup = svg.append('g').attr('id', 'playBackGroup');
    playBackLineGroup = playBackGroup.append('g').attr('id', 'playBackLineGroup');
    playBackCircleGroup = playBackGroup.append('g').attr('id', 'playBackCircleGroup');

    timelineOffset = 30;
    densityOffset = -30;
  }

  function startAnimation() {
    printLog('started');
    init();
    started = true;
    finished = false;
    updateControls();
    addText(selectData());
  }

  function endAnimation() {
    printLog('finished');
    finished = true;
    started = false;
    updateControls();
    // Clean playback area.
    setTimeout(resetForNextTrial, 4000);
  }

  function selectData() {
    //printLog(window.location.hash);
    return window.location.hash === '#custom' ? customData : demoData;
  }

  function updateControls() {
    // TODO Update controls
  }

  function addText(data) {
    // TODO Automate sentence line append. (It is hard-coded now.)
    $('#readText').css({
        top: data.sentenceY,
        left: data.sentenceX,
        fontSize: data.fontSize + 'px'
      }).append('<span id="line1">' + data.sentenceLine1 + '</span>')
      .append('<span id="line2">' + data.sentenceLine2 + '</span>')
      .fadeIn(function() {
        drawTrials(data, 0);
      });

    if (typeof data.sentenceLine2 != 'undefined' && data.sentenceLine2 != '') {
      // Get first line width and set.
      data.sentenceLine2StartOffset = $('#line1').width();
      printLog('sentenceLine2StartOffset: ' + data.sentenceLine2StartOffset);
    }
    calibrate(data);
  }

  function drawTrials(data, i) {
    //debug('drawTrials');
    // TODO Show current running trial as message. (e.g. trial1, trial2)
    return drawMovements(data.trials[i], i, 0, function() {
      if (stopped) {
        return;
      }
      if (i + 1 < data.trials.length) {
        setTimeout(function() {
          // Clean playback area.
          resetForNextTrial();
          // Call next trial.
          setTimeout(function() {
            drawTrials(data, i + 1);
          }, 1000);
        }, 4000);
      } else {
        endAnimation();
      }
    });
  }

  function drawMovements(trial, i, j, callback) {
    //debug('drawMovements');
    return animateAll(trial[j], function() {

      if (stopped) {
        return;
      }

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
      .attr('fill', obj.color)
      .attr('r', 0)
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
        path: 'M ' + movement.x1 + ' ' + movement.y1 + ' Q ' + (movement.x1 + (movement.x2 - movement.x1) / 2) + ' ' + (movement.y1 - 30) + ' ' + movement.x2 + ' ' + movement.y2,
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
        color: fixationColor,
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
        path: 'M ' + movement.x1 + ' ' + (movement.y1 + timelineOffset) + ' H ' + movement.x2,
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
    // FIXME Stop animation.
    stopped = true;

    // Clear all svg.
    d3.select("svg").remove();

    // Fade out text.
    $('#readText').html('').fadeOut();

    // Remove #demo from url.
    if (window.history.pushState) {
      window.history.pushState('', '/', window.location.pathname)
    } else {
      window.location.hash = '';
    }

    // Reset custom data.
    customData = {};

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

  $('#visualize').click(function() {

    try {
      // Read inputs.
      customData.userTrials = JSON.parse($('#trialData').val()) || [];
      customData.sentenceLine1 = $('#sentenceLine1').val() || '';
      customData.sentenceLine2 = $('#sentenceLine2').val() || '';
      customData.fontSize = parseInt($('#fontSize').val(), 10) || 14;
      customData.sentenceX = parseInt($('#sentenceX').val(), 10) || 20;
      customData.sentenceY = parseInt($('#sentenceY').val(), 10) || 180;
      customData.xFix = parseInt($('#xFix').val(), 10) || 0;
      customData.yFix = parseInt($('#yFix').val(), 10) || 0;

      console.log(customData);

      // Convert user input.
      convertCustomData();

      console.log(customData);

    } catch (e) {
      console.error(e);
      // TODO Show error messages to user.
      return;
    }

    window.location.hash = 'custom';

    // Close modal panel.
    $('#customVisModal').modal('hide');

    // Start animation.
    $('#projectInfo').fadeOut(function() {
      $('#animationCanvas').fadeIn(function() {
        startAnimation();
      });
    });

  });

  /**************************************************
   * Convert custom data                            *
   **************************************************/

  function convertCustomData() {
    var trials = [],
      trial,
      trialIndex = -1,
      previousEvent;

    customData.userTrials.forEach(function(data) {
      // Check new trial
      if (data.TRIAL_INDEX != trialIndex) {
        if (typeof trial != 'undefined') {
          // Push previous trial
          trials.push(trial);
        }
        // Create new trial
        trial = new Array();
        trialIndex = data.TRIAL_INDEX;
      }

      if (typeof previousEvent != 'undefined') {
        // Insert saccade
        trial.push({
          type: 'saccade',
          duration: previousEvent.NEXT_SAC_END_TIME - previousEvent.NEXT_SAC_START_TIME,
          x1: previousEvent.CURRENT_FIX_X,
          x2: data.CURRENT_FIX_X,
          y1: previousEvent.CURRENT_FIX_Y,
          y2: data.CURRENT_FIX_Y
        });
      }

      // Insert fixation event.
      trial.push({
        type: 'fixation',
        duration: data.CURRENT_FIX_DURATION,
        x: data.CURRENT_FIX_X,
        y: data.CURRENT_FIX_Y
      });
      previousEvent = data;
    });

    // Append last trial.
    trials.push(trial);

    // Set trials to customData
    customData.trials = trials;

    // Remove user input.
    //customData.userTrials = 'undefined';
  }

  // Calibrate data
  function calibrate(data) {
    if (data.calibrated) {
      return;
    }

    data.trials.forEach(function(trial) {
      trial.forEach(function(movement) {
        if (movement.type === 'fixation') {
          movement.x += data.xFix;
          movement.y += data.yFix;
        } else if (movement.type === 'saccade') {
          movement.x1 += data.xFix;
          movement.x2 += data.xFix;
          movement.y1 += data.yFix;
          movement.y2 += data.yFix;
        }
      });
    });

    // line2 fix
    if (typeof data.sentenceLine2StartOffset != 'undefined') {
      // For saccade, x1-x2 and y1-y2 must be negative, and difference must be bigger than the others.
      printLog('applying line2 fix');

      data.trials.forEach(function(trial) {
        var shift = false;
        trial.forEach(function(movement) {
          if (shift) {
            if (movement.type === 'fixation') {
              movement.x += data.sentenceLine2StartOffset + data.xFix;
            } else if (movement.type === 'saccade') {
            movement.x1 += data.sentenceLine2StartOffset + data.xFix;
            movement.x2 += data.sentenceLine2StartOffset + data.xFix;
            }
          }
          if (movement.type === 'saccade') {
            if (movement.y1 - movement.y2 < 0 && movement.x1 - movement.x2 > 0 && movement.x1 - movement.x2 > 0.7 * data.sentenceLine2StartOffset) {
              printLog('shift started diff: ' + (movement.x1 - movement.x2));
              shift = true;
              movement.x2 += data.sentenceLine2StartOffset;
            }
          }
        });
      });
    }

    // Stabilize all y positions.
    data.trials.forEach(function(trial) {
      trial.forEach(function(movement) {
        if (movement.type === 'fixation') {
          movement.y = data.sentenceY - 30;
        } else if (movement.type === 'saccade') {
          movement.y1 = data.sentenceY - 30;
          movement.y2 = data.sentenceY - 30;
        }
      });
    });

    data.calibrated = true;

    console.log(data);
  }

}
