const fs = require('fs')

let state = fs.readFileSync('./data.txt', 
            {encoding:'utf8', flag:'r'});
console.log(state.split('\n'));
state = state.split('\n');
console.log(Array.isArray(state));
state[0] = state[0].replace('0','1');
console.log(state[0]); 
state = state.join('\n');
console.log(state);
