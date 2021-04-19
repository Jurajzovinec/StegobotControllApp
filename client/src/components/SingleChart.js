import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Chart } from 'react-charts';

const useStyles = makeStyles({
    chart: {
        width: '80%',
        minWidth: '600px',
        minHeight:'200px',
        margin: 5,
        padding: 5,
        display: 'block',
        
    }
});

const SingleChart = ({ dataset }) => {
    const classes = useStyles();
    const data = React.useMemo(() =>
        [
            {
                data: dataset,                    
                stepped:true

            }
        ],
        [dataset]
    );
    const axes = React.useMemo(
        () => [
            {
                primary: true,
                type: 'linear',
                position: 'bottom',
            },
            {
                type: 'linear',
                position: 'left'
            }
        ],
        []
    )
    
    return (
        <div className={classes.chart} >
            < Chart
                data={data}
                axes={axes}
            />
        </div>
    );

}

export default SingleChart;
