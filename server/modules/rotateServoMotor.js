const rotateServoMotor = async (servoInstructions) => {

    if (arduinoBoard.isReady) {

        const { Servo } = require("johnny-five");
        const servo = new Servo({
            pin: 9,
            //type: "continuous",
        });

        const timeInstructions = servoInstructions.map((instruction, index) => {
            
            /*
            [
                { x: 0, y: 0 },   
                { x: 1, y: 45 },
                { x: 2.7, y: 180 },
            ]
            =>
            [
                [0,0],
                [1000, 45],
                [1700, 180]
            ]
            */

            const previousTime = (index == 0) ? 0 : servoInstructions[index - 1].x;

            return [Math.floor((instruction.x - previousTime) * 1000), instruction.y];

        });

        servo.min();

        const rotateAsync = async (howLong, toPosition) => {
            return new Promise((resolve, reject) => {

                servo.to(toPosition, howLong);
                setTimeout(() => resolve(), howLong);

            })

        }

        for (const instruction of timeInstructions) {
            console.log(instruction);
            await rotateAsync(instruction[0], instruction[1]);
        }

    }

}

module.exports = rotateServoMotor;

