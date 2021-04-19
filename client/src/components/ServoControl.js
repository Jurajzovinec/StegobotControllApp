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

    const duration = 3; 
    const [dataset, setDataset] = React.useState(() => [[0, 0], [duration, 0]]);

    const [timeBreakpoint, setTimeBreakpoint] = React.useState(undefined);
    const [angleBreakpoint, setAngleBreakpoint] = React.useState(undefined);
    const [toggleStart, setToggleStart] = React.useState(false);

    const classes = useStyles();

    const handleSendGraph = () => {

        setToggleStart(!toggleStart);

        const io = require("socket.io-client");
        const socket = io("ws://localhost:8080");
        
        socket.on('welcomeMessage', (welcomeMessage)=>{
            console.log(welcomeMessage);
        });
        
        socket.emit('servoInstructions', {dataset:dataset});
    }

    const injectNewServoSpeed = (event) => {
        event.preventDefault();

        if ([timeBreakpoint, angleBreakpoint].some(isNaN)) {
            alert("All Inputs have to be numeric.");
            return;
        }

        if (timeBreakpoint < 0 || timeBreakpoint > 3) {
            alert(`Select input index from range 0 and ${dataset.length}`);
            return;
        }

        if (angleBreakpoint < 0 || angleBreakpoint > 180) {
            alert(`Select point angle from range 0 and 180.`);
            return;
        }

        const preventDuplicatedTime = (dataCoordinates) => {
            return dataCoordinates[0] == timeBreakpoint;
        };

        if (dataset.some(preventDuplicatedTime)) {
            alert('This time has its own angle value set already.');
            return;
        }

        const defineIndexWhereToPushNewCoordinates = () => {
            let injectIndex = 0;

            dataset.forEach((data, index) => {
                if (data[0] < timeBreakpoint) injectIndex = index + 1;
            })

            return injectIndex;
        };

        const newPointCoordinates = [parseFloat(timeBreakpoint), parseFloat(angleBreakpoint)];
        const storedDataset = [...dataset];

        storedDataset.splice(defineIndexWhereToPushNewCoordinates(), 0, newPointCoordinates);
        setDataset(storedDataset);

    }

    return (
        <div className="servo-control">

            <SingleChart dataset={dataset} />

            <form className="inject-new-point-form" noValidate autoComplete="off" onSubmit={injectNewServoSpeed}>

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
                <ElapsedTime toggleStart={toggleStart} duration={duration} />
            </div>

        </div>
    )
}

export default ServoControl;
