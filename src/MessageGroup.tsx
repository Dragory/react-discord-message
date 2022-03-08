import React from "react";
import {MessageData, Theme} from "./types";
import {Message} from "./Message";

type MessageGroupProps = {
  theme?: Theme,
  messages: MessageData[],
};

export function MessageGroup({ theme, messages }: MessageGroupProps) {
  return <div>
    {messages.map((message, i) => <React.Fragment key={i}>
      <Message data={message} theme={theme} merged={i !== 0} />
    </React.Fragment>)}
  </div>;
}
