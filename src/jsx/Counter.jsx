import React, { /* useState, useEffect */ useRef } from 'react';

// https://www.npmjs.com/package/react-countup
import CountUp from 'react-countup';
// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

// Load helpers.
import easingFn from './helpers/EasingFn.js';

import '../styles/styles.less';

function Counter() {
  const chartRef = useRef();
  const isVisible = useIsVisible(chartRef, { once: true });

  return (
    <div className="app">
      <div className="counter_container">
        <h4>It would require</h4>
        <div ref={chartRef}>
          {(isVisible) && (<div className="counter"><CountUp easingFn={easingFn} end={18400000000} duration={5} separator="," useEasing /></div>)}
        </div>
        <h4>trucks to carry all the plastic products exported in the world in a year</h4>
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Counter;
