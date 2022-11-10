import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

// https://www.highcharts.com/
import Highcharts from 'highcharts';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsExportData from 'highcharts/modules/export-data';
import highchartsMore from 'highcharts/highcharts-more';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import roundNr from '../helpers/RoundNr.js';

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);
highchartsMore(Highcharts);

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    downloadCSV: 'Download CSV data',
    thousandsSep: ','
  }
});
Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => {
  const path = [
    // Arrow stem
    'M', x + w * 0.5, y,
    'L', x + w * 0.5, y + h * 0.7,
    // Arrow head
    'M', x + w * 0.3, y + h * 0.5,
    'L', x + w * 0.5, y + h * 0.7,
    'L', x + w * 0.7, y + h * 0.5,
    // Box
    'M', x, y + h * 0.9,
    'L', x, y + h,
    'L', x + w, y + h,
    'L', x + w, y + h * 0.9
  ];
  return path;
};

function LineChart({
  allow_decimals, data, idx, note, show_first_label, source, subtitle, title
}) {
  const chartRef = useRef();
  const isVisible = useIsVisible(chartRef, { once: true });

  const chartHeight = 650;
  const createChart = useCallback(() => {
    Highcharts.chart(`chartIdx${idx}`, {
      caption: {
        align: 'left',
        margin: 15,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Roboto',
          fontSize: '14px'
        },
        text: `<em>Source:</em> ${source} ${note ? (`<br /><em>Note:</em> <span>${note}</span>`) : ''}`,
        verticalAlign: 'bottom',
        x: 0
      },
      chart: {
        events: {
          load() {
            // eslint-disable-next-line react/no-this-in-sfc
            this.renderer.image('https://unctad.org/sites/default/files/2022-06/unctad_logo.svg', 5, 15, 80, 100).add();
          }
        },
        height: chartHeight,
        resetZoomButton: {
          theme: {
            fill: '#fff',
            r: 0,
            states: {
              hover: {
                fill: '#0077b8',
                stroke: 'transparent',
                style: {
                  color: '#fff',
                  fontFamily: 'Roboto',
                }
              }
            },
            stroke: '#7c7067',
            style: {
              fontFamily: 'Roboto',
              fontSize: '13px',
              fontWeight: 400
            }
          }
        },
        marginTop: 160,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Roboto',
          fontWeight: 400
        },
        type: 'packedbubble',
        zoomType: 'x'
      },
      colors: ['#009edb', '#72bf44'],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'separator', 'downloadCSV'],
            symbol: 'download',
            symbolFill: '#000'
          }
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        packedbubble: {
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 250
            },
            style: {
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'Roboto',
              fontWeight: 700
            }
          },
          draggable: false,
          layoutAlgorithm: {
            splitSeries: false,
            gravitationalConstant: 0.01
          },
          marker: {
            fillOpacity: 1,
            lineColor: '#999'
          },
          maxSize: '250%',
          minSize: '30%',
          states: {
            hover: {
              halo: {
                size: 0
              },
              enabled: false,
              lineWidth: 0,
            },
            select: {
              enabled: false
            }
          }
        }
      },
      responsive: {
        rules: [{
          chartOptions: {
            legend: {
              layout: 'horizontal'
            }
          },
          condition: {
            maxWidth: 500
          }
        }]
      },
      series: data,
      subtitle: {
        align: 'left',
        enabled: true,
        widthAdjust: -160,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '18px'
        },
        x: 100,
        text: subtitle
      },
      title: {
        align: 'left',
        margin: 80,
        widthAdjust: -190,
        style: {
          color: '#000',
          fontSize: '30px',
          fontWeight: 700,
          lineHeight: '34px'
        },
        x: 100,
        text: title
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
        crosshairs: true,
        shadow: false,
        shared: true,
        useHTML: true,
        formatter() {
          // eslint-disable-next-line react/no-this-in-sfc
          return `<div class="tooltip_container"><div><span class="tooltip_label">${this.point.name}</span><br /><span class="tooltip_value">${roundNr(this.point.value, 0).toLocaleString('en-US')} billion US dollars</span></div></div>`;
        },
      },
      xAxis: {
        allowDecimals: false,
        crosshair: {
          color: '#ccc',
          width: 1
        },
        labels: {
          enabled: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Roboto',
            fontSize: '14px',
            fontWeight: 400
          },
          useHTML: false,
          y: 30
        },
        lineColor: '#ccc',
        lineWidth: 0,
        opposite: false,
        tickLength: 5,
        tickWidth: 1,
        type: 'datetime',
        title: {
          enabled: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400
          },
          text: 'Year'
        }
      },
      yAxis: [{
        allowDecimals: allow_decimals,
        gridLineColor: 'rgba(124, 112, 103, 0.2)',
        gridLineDashStyle: 'shortdot',
        gridLineWidth: 1,
        labels: {
          reserveSpace: true,
          style: {
            color: '#009edb',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400
          }
        },
        lineColor: 'transparent',
        lineWidth: 0,
        max: undefined,
        opposite: false,
        showFirstLabel: show_first_label,
        showLastLabel: true,
        title: {
          enabled: true,
          reserveSpace: true,
          style: {
            color: '#009edb',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400
          },
          text: 'Value',
        },
        type: 'linear'
      }, {
        allowDecimals: allow_decimals,
        gridLineColor: 'rgba(124, 112, 103, 0.2)',
        gridLineDashStyle: 'shortdot',
        gridLineWidth: 1,
        labels: {
          reserveSpace: true,
          style: {
            color: '#72bf44',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400
          }
        },
        lineColor: 'transparent',
        lineWidth: 0,
        opposite: true,
        showFirstLabel: show_first_label,
        tickInterval: 50000,
        showLastLabel: true,
        title: {
          enabled: true,
          reserveSpace: true,
          style: {
            color: '#72bf44',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400
          },
          text: 'Volume',
        },
        type: 'linear'
      }]
    });
    chartRef.current.querySelector(`#chartIdx${idx}`).style.opacity = 1;
  }, [allow_decimals, data, idx, note, show_first_label, source, subtitle, title]);

  useEffect(() => {
    if (isVisible === true) {
      setTimeout(() => {
        createChart();
      }, 300);
    }
  }, [createChart, isVisible]);

  return (
    <div className="chart_container">
      <div ref={chartRef}>
        {(isVisible) && (<div className="chart" id={`chartIdx${idx}`} />)}
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

LineChart.propTypes = {
  allow_decimals: PropTypes.bool,
  data: PropTypes.instanceOf(Array).isRequired,
  idx: PropTypes.string.isRequired,
  note: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  show_first_label: PropTypes.bool,
  source: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

LineChart.defaultProps = {
  allow_decimals: true,
  note: false,
  show_first_label: true,
  subtitle: false,
};

export default LineChart;
