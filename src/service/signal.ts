/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Centrifuge, State } from 'centrifuge';
import protobufSingnal from './protobufSingnal';
import hub from './hub';
export const signal = {
    sub: null,
    firstConnected: false,
    connect() {
        let meetID=30;
        const PID='d2c9f7pn4tjh7d2q06p0';

        const url = 'ws://localhost:8003/wsroom';
        const centrifuge = protobufSingnal.getWebSocket(url, PID);
        centrifuge.on('error', function (c: unknown) {
            console.error(c);
        });
        centrifuge.on('connecting', function (ctx: unknown) {
            //drawText('Connecting1: ' + ctx.reason);
            console.warn(centrifuge.state)

        });

        centrifuge.on('disconnected', function (ctx: any) {
            console.error('Disconnected: ' + ctx.reason);
            console.error('disconnect');

        });
        centrifuge.on('connected', function (ctx: any) {
            console.warn('connected');
        });
        centrifuge.on('message', function (ctx: any) {
            // drawText('Message: ' + JSON.stringify(ctx.data));
            // console.log(ctx.data);
            hub.HandleData(ctx);

        });
        const sub = centrifuge.newSubscription('meet-' + meetID);
        sub.subscribe();
        centrifuge.connect();

        sub.on('publication', signal.handlePublication).on('subscribed', signal.handleSubscribed);

        signal.sub = sub;


    },
    handleSubscribed(ctx: any) {

    },
    handlePublication(message: any) {
        //console.log(message);
        hub.HandleData(message)

    }
}
