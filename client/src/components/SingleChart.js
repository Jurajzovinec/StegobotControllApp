import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Scatter } from "react-chartjs-2";

const useStyles = makeStyles({
  chart: {
    width: '800px',
    height: '400px',
    padding: 5,
    margin: 2
  }
});

const SingleChart = ({ dataset, deletePoint }) => {

  const classes = useStyles();

  const data = {
    labels: ['Scatter'],
    datasets: [
      {
        label: 'movement curve',
        fill: false,
        showLine: true, 
        backgroundColor: 'rgba(75,192,192,0.4)',
        pointBorderColor: 'rgba(0,0,0,1)',
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 10,
        pointRadius: 10,
        pointHitRadius: 10,
        data: dataset
      }
    ]
  };


  return (
    <div className={classes.chart}>
      <Scatter
        data={data}
        options={{
          onClick:  (event, element) => {
            if (element.length > 0) {
              deletePoint(element[0]._index);
            }
          }
        }}
      />
    </div>
  );
}

export default SingleChart;