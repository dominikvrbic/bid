import { EventEmitter } from 'events';

export default class Socket extends EventEmitter {
        static get SOCKET_STATE() {
                return {
                        CONNECTING: 0,
                        OPEN: 1,
                        CLOSING: 2,
                        CLOSED: 3,
                };
        }

        constructor(url, options = {}) {
                super();
                this.url = url;
                this.options = options;
                this.socket = null;
                this.lastState = null;
                this.waitingToReconnect = false;
                this.reconnectInterval = {
                        current: 1 * 1000,
                        initial: 1 * 1000,
                        max: 30 * 1000,
                };

                this.connect();
        }

        connect() {
                console.log('Socket connecting');
                if (this.socket) {
                        this.socket.close();
                }
                this.socket = new WebSocket(this.url);
                this.socket.onopen = () => {
                        // console.log('Socket connected');
                        this.lastState = Socket.SOCKET_STATE.OPEN;
                        this.reconnectInterval.current = this.reconnectInterval.initial;
                        this.emit('connect');
                };

                this.socket.onclose = (e) => {
                        console.warn('Socket close: ', e);
                        this.lastState = Socket.SOCKET_STATE.CLOSED;
                        this.reconnect();
                };

                this.socket.onerror = (error) => {
                        console.error('Socket Error: ', error);
                };

                this.socket.onmessage = (e) => {
                        const msg = JSON.parse(e.data);
                        if (window.WS_DEBUG) {
                                console.debug('SOCKET <--', msg.type, msg.data);
                        }
                        this.emit(msg.type, msg.data);
                };
        }

        reconnect() {
                if (this.waitingToReconnect) {
                        return;
                }
                console.log(`Reconnect in ${this.reconnectInterval.current}ms`);
                setTimeout(() => {
                        this.reconnectInterval.current = Math.min(
                                this.reconnectInterval.current * 2,
                                this.reconnectInterval.max,
                        );
                        this.waitingToReconnect = false;
                        this.connect();
                }, this.reconnectInterval.current);
        }

        send(type, data) {
                if (window.WS_DEBUG) {
                        console.debug('SOCKET -->', type, data);
                }
                this.socket.send(JSON.stringify({ type, data }));
        }
}
