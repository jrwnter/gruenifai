import openSocket from 'socket.io-client';
const  socket = openSocket('http://0.0.0.0:5050');
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 109);
}
export { subscribeToTimer };