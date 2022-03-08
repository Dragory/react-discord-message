import React from "react";
import {extendType, MessageData, RequiredWithDefaults, Theme} from "./types";
import styled, {css} from "styled-components";
import {MessageGroup} from "./MessageGroup";
import {DARK_MODE_BG, LIGHT_MODE_BG} from "./colors";

const MINUTE = 1000 * 60;

function shouldMergeMessages(previousMessage: MessageData, message: MessageData): boolean {
  if (previousMessage.author.id !== message.author.id) {
    return false;
  }

  const previousMessageDate = previousMessage.timestamp ? new Date(previousMessage.timestamp) : new Date();
  const messageDate = message.timestamp ? new Date(message.timestamp) : new Date();

  if (previousMessageDate.getDate() !== messageDate.getDate()) {
    return false;
  }

  if (messageDate.getTime() - previousMessageDate.getTime() > 5 * MINUTE) {
    return false;
  }

  return true;
}

const StyledMessageList = styled.div<{ theme: Theme, spaceBetweenMessageGroups: number }>`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  
  ${props => css`
    gap: ${props.spaceBetweenMessageGroups}px;
  `}

  ${props => props.theme === "dark" && css`
    background-color: ${DARK_MODE_BG};
  `}

  ${props => props.theme === "light" && css`
    background-color: ${LIGHT_MODE_BG};
  `}
`;

export type MessageListProps = {
  messages: MessageData[],
  theme: Theme,
  spaceBetweenMessageGroups: number,
};
const defaultProps = extendType<Partial<MessageListProps>>()({
  theme: "dark",
  spaceBetweenMessageGroups: 16,
});
type RequiredMessageListProps = RequiredWithDefaults<MessageListProps, typeof defaultProps>;

export function MessageList(props: RequiredMessageListProps) {
  const fullProps = { ...defaultProps, ...props } as MessageListProps;
  const { messages, theme, spaceBetweenMessageGroups } = fullProps;

  const messageGroups: MessageData[][] = messages.reduce((groups, message) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.length === 0 || shouldMergeMessages(lastGroup[lastGroup.length - 1], message)) {
      lastGroup.push(message);
    } else {
      groups.push([message]);
    }
    return groups;
  }, [[]] as MessageData[][]);

  return <StyledMessageList {...fullProps}>
    {messageGroups.map((group, i) => <React.Fragment key={i}>
      <MessageGroup messages={group} theme={theme} />
    </React.Fragment>)}
  </StyledMessageList>;
}
