import React, { /* useState, useEffect */ } from 'react';

// https://www.npmjs.com/package/react-countup
import CountUp from 'react-countup';

// Load helpers.
import easingFn from './helpers/EasingFn.js';

import '../styles/styles.less';

function Counter() {
  return (
    <div className="app">
      <div className="counter_container">
        <h4>It would require</h4>
        <div className="counter"><CountUp easingFn={easingFn} end={18400000000} duration={5} separator="," useEasing /></div>
        <h4>trucks to carry all the plastic products exported in the world in a year</h4>
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Counter;
