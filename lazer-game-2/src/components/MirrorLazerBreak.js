import React from 'react';
import './style.css'; // import the CSS file

function MirrorLazerBreak() {
  return (
    <div>
      <h1>Mirror Lazer Break</h1>
      <div id="box">
        <canvas id="mirrorBreakLazer" height="600px" width="600px"></canvas>
        <div id="menu">
          <button id="start">Start</button>
          <button id="pause">Stop</button>
          <button id="next">Skip Level</button>
          <button id="previous">Previous Level</button>
          <button id="reset">Reset Level</button>
        </div>
      </div>
      <div id="speed">
        <button id="speed1">Slow</button>
        <button id="speed2">Medium</button>
        <button id="speed3">Fast</button>
      </div>
      <p>© 2019 Itamar Mizrahi All Rights Reserved</p>
    </div>
  );
}

export default MirrorLazerBreak;