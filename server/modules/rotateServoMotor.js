const rotateServoMotor = async (servoInstructions) => {

    if (arduinoBoard.isReady) {

        const { Servo } = require("johnny-five");
        const servo = new Servo({
            pin: 9,
            //type: "continuous",
        });

        const timeInstructions = servoInstructions.map((instruction, index)=>{
            const previousTime = (index==0)? 0:servoInstructions[index-1][0];
            return [Math.floor((instruction[0]-previousTime)*1000), instruction[1]];
        })

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

