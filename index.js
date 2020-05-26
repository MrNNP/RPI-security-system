var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs')
let path = 'data.txt';
function invert(a){
  if (a==0){
    return 1;
  } else if (a==1){
    return 0;
  }
}
function prepare(state,value){
  state = state.split('\n');

state[0] = state[0].replace(invert(value),value);
state = state.join('\n');
return state;
}
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
socket.on('disconnect', (socket) => {
    console.log('a user disconnected');
  });
  socket.on("message", (msg) =>{
    let armstate = fs.readFileSync('./data.txt', 
    {encoding:'utf8', flag:'r'}); 
      console.log("System state was set to:"+msg.toString());
      armstate = prepare(armstate,msg.toString());
      fs.open(path, 'w', function(err, fd) {
        if (err) {
            throw 'could not open file: ' + err;
        }
        
        let buffer = new Buffer.from(armstate)
        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(fd, buffer, 0, buffer.length, 0, function(err,data) {
            if (err) throw 'error writing file: ' + err;
            fs.close(fd, function() {
                console.log('System status on file was updated');
            });
        });
    });
  })
});

http.listen(8080, () => {
  console.log('listening on *:8080');
});