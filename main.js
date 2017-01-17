window.onload = function() {

  var width = $(document).width(),
    height = $(document).height();

  var saccadeColor = '#F6004F',
    fixationColor = '#666';

  var paused = false,
    finished = false,
    started = false;

  var svg = d3.select('#animationCanvas').append('svg').attr('width', width).attr('height', height);

  function startAnimation() {
    started = true;
    finished = false;
    drawMovements(0);
  }

  function endAnimation() {
    finished = true;
    started = false;
  }

  function drawMovements(i) {
    return animateElement(data[i], drawElement(data[i]), function() {
      if (i + 1 < data.length) {
        drawMovements(i + 1);
      } else {
        endAnimation();
      }
    });
  }

  function drawElement(movement) {
    if (movement.type === 'saccade') {
      return drawLine(movement);
    } else if (movement.type === 'fixation') {
      return drawCircle(movement);
    }
    return null;
  }

  function drawLine(movement) {
    // line = 'M ' + movement.x1 + ' ' + movement.y + ' L ' + movement.x2 + ' ' + movement.y
    var line = 'M ' + movement.x1 + ' ' + movement.y + ' Q ' + (movement.x1 + (movement.x2 - movement.x1) / 2) + ' ' + (movement.y - 30) + ' ' + movement.x2 + ' ' + movement.y
    return svg.append('path')
      .attr('d', line)
      .attr('stroke', saccadeColor)
      .attr('stroke-width', '1')
      .attr('fill', 'none');
  }

  function drawCircle(movement) {
    return svg.append('circle')
      .attr('cx', movement.x1)
      .attr('cy', movement.y)
      .attr('r', 0)
      .attr('fill', fixationColor);
  }

  function animateElement(movement, element, callback) {
    if (movement.type === 'saccade') {
      return animateLine(element.node().getTotalLength(), movement.duration, element, callback);
    } else if (movement.type === 'fixation') {
      return animateCircle(movement.duration, element, callback);
    }
    return;
  }

  function animateLine(totalLength, duration, path, callback) {
    return path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(duration)
      .ease('linear')
      .attr('stroke-dashoffset', 0)
      .each('end', callback);
  }

  function animateCircle(duration, circle, callback) {
    return circle
      .transition()
      .duration(duration)
      .ease('linear')
      .attr('stroke-dashoffset', 0)
      .attr('r', duration / 20)
      .each('end', callback);
  }

  /* UI Bindings */
  $('#startButton').click(function() {
    $(this).fadeOut(function() {
      startAnimation();
    });
  });

}
