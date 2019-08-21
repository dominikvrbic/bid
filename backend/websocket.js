
function wsSend(socket, type, data) {
    const msg = { type, data };
    socket.send(JSON.stringify(msg));
}

app.ws('/socket', (ws, req) => {
    setInterval(() => {
        wsSend(ws, 'priceChange', { price: 100, imageId: 123 });
    }, 2000);

    ws.on('message', msg => {
        console.log('Got sg: ', msg);
        ws.send(msg);
    });

    ws.on('close', () => {
        console.log('WebSocket was closed')
    });
});