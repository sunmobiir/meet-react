import { Centrifuge } from 'centrifuge/build/protobuf';
const protobufSingnal = {
  getWebSocket(wsUrl: string, PID: string): Centrifuge {
    const centrifuge = new Centrifuge(wsUrl, {
      token: PID,
    });
    return centrifuge;
  },
};
export default protobufSingnal;
