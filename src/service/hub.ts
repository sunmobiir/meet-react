/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageRequest, MessageResponse } from '../model/messaging_pb';
import { useChatStore } from '@/store/useChatStore';
import { useParticipantStore } from '@/store/useParticipantStore';
import { ActivePanelType, MeetStatus } from '../model/messaging_pb';
import { useEffect } from 'react';
import { ChatPanel } from '@/components/ChatPanel';
const hub = {
  HandleData(ev: any) {
    //console.log(ev.data)
    if (ev == undefined) return;
    if (ev.data == undefined) return;
    const resp: MessageResponse = MessageResponse.fromBinary(new Uint8Array(ev.data));

    console.log(resp)
    //let str = new TextDecoder("utf-8").decode(ev.data);
    // console.log(str)
    // resp = MessageResponse.fromJsonString(str)
    // if (typeof ev.data === 'string') {
    //   resp = MessageResponse.fromJsonString(ev.data)
    // } else if (ev.data instanceof ArrayBuffer) {

    // } else {
    //   //  resp = MessageResponse.fromBinary(new Uint8Array(ev.data));
    //   console.error(`could not decode websocket message: ${typeof ev.data}`);
    //   return;
    // }
    if (resp == undefined) {
      console.error('could not parse message');
      return;
    }
    this.parse(resp)


  },
  parse: function (m: MessageResponse) {
    //  console.warn(m)

    switch (m.message.case) {
      case 'chatMessage':
        // chatService.parse(m.message.value);
        break;
      case 'meetStatus':
        this.UpdateChatMessages(m.message.value);
        break;
    }
  },

  UpdateChatMessages: function (m: MeetStatus) {



    // Convert the chatList object to an array of Chat objects
    const chatArray = Object.values(m.chatList);
    useChatStore.getState().addMessages(chatArray);


    useParticipantStore.getState().setParticipants(Object.values(m.userList));
    //console.log(chatStore)
  },
}
export default hub