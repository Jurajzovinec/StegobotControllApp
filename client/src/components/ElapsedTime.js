import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useElapsedTime } from "use-elapsed-time";

const useStyles = makeStyles({
    elapsedTime: {
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    }
});

const ElapsedTimeComponent = ({duration}) => {

    const classes = useStyles();
    const isPlaying = true;

    const options = { duration };

    const { elapsedTime } = useElapsedTime(isPlaying, options);
    const remainingTime = Math.ceil((duration - elapsedTime) * 10) / 10

    return (
        <Typography className={classes.elapsedTime}>
            {remainingTime}
        </Typography>
    )

}

const ElapsedTime = ({ toggleStart, duration }) => {
    
    const [key, setKey] = React.useState(undefined);

    React.useEffect(() => {
        if (toggleStart) setKey(new Date().getTime());
    }, [toggleStart]);

    return (
        (key ? <ElapsedTimeComponent key={key} duration={duration}/> : null)
    )
};

export default ElapsedTime;
