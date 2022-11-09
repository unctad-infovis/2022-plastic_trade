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
    const values = Object.values(el).map(val => parseFloat(val) * 1000).filter((val, i) => i > 0);

    const max_value = Math.max(...values);

    console.log(max_value);

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
        note="NOTES"
        source="SOURCE"
        subtitle="SUBTITLE"
        suffix=""
        title="TITLE 2"
        ylabel=""
      />
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Figure1;
