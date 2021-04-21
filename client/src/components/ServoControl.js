import React from 'react';
import SingleChart from './SingleChart';
import { TextField, makeStyles, Button } from '@material-ui/core';
import ElapsedTime from './ElapsedTime';

const useStyles = makeStyles({
    field: {
        margin: 2,
        padding: 2,
        display: 'block',

    },
    consoleButton: {
        width: '200px',
        height: '50px',
        margin: 2,
        padding: 2,
    },
    expectedLog: {
        width: '100%',
        height: '80%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    typography: {
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    }
});

const ServoControl = () => {

    const classes = useStyles();

    const [dataset, setDataset] = React.useState(
        [
            { x: 0, y: 0 },
            { x: 1, y: 45 },
            { x: 2, y: 180 },
            { x: 3, y: 0 },
        ]

    );

    const setDurationToLastServoPositionTime = () => {
        const datasetCopy = [...dataset];
        if (datasetCopy.length > 0) return datasetCopy.splice(-1).pop().x;
        return 0;
    };

    const [duration, setDuration] = React.useState(setDurationToLastServoPositionTime());

    const [timeBreakpoint, setTimeBreakpoint] = React.useState(undefined);
    const [angleBreakpoint, setAngleBreakpoint] = React.useState(undefined);
    const [toggleStart, setToggleStart] = React.useState(false);

    const deletePoint = (indexPoint) => {
        const datasetCopy = [...dataset];
        if (indexPoint > -1) datasetCopy.splice(indexPoint, 1);
        setDataset(datasetCopy);
    };
    
    const injectNewServoSpeed = (event) => {
        event.preventDefault();

        const defineIndexWhereToPushNewCoordinates = () => {
            let injectIndex = 0;
            dataset.forEach((data, index) => {
                if (data.x < timeBreakpoint) injectIndex = index + 1;
            })
            return injectIndex;
        };

        const preventDuplicatedTime = (dataCoordinates) => {
            return dataCoordinates.x == timeBreakpoint;
        };

        if ([timeBreakpoint, angleBreakpoint].some(isNaN)) {
            alert("All Inputs have to be numeric.");
            return;
        }
        if (angleBreakpoint < 0 || angleBreakpoint > 180) {
            alert(`Select point angle from range 0 and 180.`);
            return;
        }
        if (dataset.some(preventDuplicatedTime)) {
            alert('This time has its own angle value set already. Delete point by clicking on it.');
            return;
        }

        const newPointCoordinates = { x: parseFloat(timeBreakpoint), y: parseFloat(angleBreakpoint) };
        const storedDataset = [...dataset];
        storedDataset.splice(defineIndexWhereToPushNewCoordinates(), 0, newPointCoordinates);
        setDataset(storedDataset);

    };

    const handleSendGraph = () => {

        setToggleStart(false);
        setToggleStart(true);

        const io = require("socket.io-client");
        const socket = io("ws://localhost:8080");

        socket.on('welcomeMessage', (welcomeMessage) => {
            console.log(welcomeMessage);
        });

        socket.emit('servoInstructions', { dataset: dataset });
    };

    React.useEffect(()=>{
        setDuration(setDurationToLastServoPositionTime());
    }, [dataset]);

    return (
        <div className="servo-control">

            <SingleChart
                dataset={dataset}
                deletePoint={deletePoint}
            />

            <form
                className="inject-new-point-form"
                noValidate
                autoComplete="off"
                onSubmit={injectNewServoSpeed}
                >

                <TextField
                    label='Set time of breakpoint'
                    variant='outlined'
                    color='primary'
                    onChange={(e) => setTimeBreakpoint(e.target.value)}
                    required
                    className={classes.field}
                >
                </TextField>

                <TextField
                    label='Point angle [0 - 180]'
                    variant='outlined'
                    color='primary'
                    onChange={(e) => setAngleBreakpoint(e.target.value)}
                    required
                    className={classes.field}
                >
                </TextField>

                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    className={classes.consoleButton}
                >Inject New Point
                </Button>

                <Button
                    color="default"
                    variant="contained"
                    className={classes.consoleButton}
                    onClick={handleSendGraph}
                >Send graph to servo</Button>

            </form>

            <div className={classes.expectedLog} >
                <ElapsedTime toggleStart={toggleStart} duration={duration} />
            </div>

        </div>
    )
}

export default ServoControl;
