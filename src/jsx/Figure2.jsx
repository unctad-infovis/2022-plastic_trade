import React, { useState, useEffect } from 'react';

// Load helpers.
import { transpose } from 'csv-transpose';
import CSVtoJSON from './helpers/CSVtoJSON.js';
import ChartPackedBubble from './components/ChartPackedBubble.jsx';

import '../styles/styles.less';

function Figure1() {
  // Data states.
  const [dataFigure, setDataFigure] = useState(false);

  const cleanData = (data) => data.filter(val => val.Name !== '').map((el) => {
    const labels = Object.keys(el).filter(val => val !== 'Name');
    const values = Object.values(el).map(val => parseFloat(val) / 1000000).filter((val, i) => i > 0);

    const max_value = Math.max(...values);

    return ({
      data: values.map((e, i) => ({
        name: labels[i],
        value: e,
        color: i === 0 ? '#72bf44' : '#009edb',
        dataLabels: {
          style: {
            fontSize: `${(Math.log1p(e / max_value)) * 30 + 5}px`,
            textOutline: (i === 0) ? '1px solid #72bf44' : '1px solid #009edb'
          }
        }
      })),
      name: '2021'
    });
  });

  useEffect(() => {
    const data_file = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2022-plastic_trade/' : './'}assets/data/2022-plastic_trade_figure_2.csv`;
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setDataFigure(cleanData(CSVtoJSON(transpose(body)))));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="app">
      {dataFigure && (
      <ChartPackedBubble
        idx="2"
        data={dataFigure}
        note="Total plastics trade has been aggregated across five stages of the life-cycle of plastics: primary forms of plastics, intermediate forms of plastics, intermediate manufactured plastic products, final manufactured plastic products, and plastic waste. The hierarchy table used for the aggregation of Harmonized-System six-digit is available on the UNCTADstat Classifications website."
        source="UNCTADstat based on calculations using UN Comtrade, https://unctadstat.unctad.org/wds/"
        subtitle="Country good exports compared to global plastics goods exports in 2021, billions of US dollars"
        suffix=""
        title="Global plastic goods exports put together would make the 4th largest goods exporter country"
        ylabel=""
      />
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Figure1;
