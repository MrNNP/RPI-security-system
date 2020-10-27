const { spawn } = require('child_process');

const email = require('./email');

const pythonproccess = spawn('python',["test.py"]); 

const datab = require('./database');

const emailpt2 = ` has been triggered.`


pythonproccess.stdout.on('error', (err)=>{
    console.log(err);
});
var states = {
    zone1:0,
    zone2:0,
    zone3:0,
    zone4:0,
    zone5:0

};

email.send('hi','<p>hello</p>');
pythonproccess.stdout.on('data', (data)=>{
    console.log(data.toString());
    data = data.toString().split('');
    if(data[0]==1){
        states.zone1 = data[1];
        if(data[1]=1){
            email.send();
        }
    } else if(data[0]==2){
        states.zone2 = data[1];
    } else if(data[0]==3){
        states.zone3 = data[1];
    }else if(data[0]==4){
        states.zone4= data[1];
    }else if(data[0]==5){
        states.zone5 = data[1];
    }
});


exports.getzonestates = function(){
    return states;
};