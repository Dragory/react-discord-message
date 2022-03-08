import React, {useEffect, useState} from "react";
import {
  APIAttachment,
  APIChannel,
  APIMessage, APIRole,
  APIUser
} from "discord-api-types/v10";
import styled, {css} from "styled-components";
import discordMarkdown from "discord-markdown";
import {extendType, MessageData, RequiredWithDefaults, Theme} from "./types";
import {
  DARK_MODE_BG,
  DARK_MODE_TEXT,
  LIGHT_MODE_BG,
  LIGHT_MODE_TEXT
} from "./colors";

const { toHTML: discordMarkdownToHTML } = discordMarkdown;

// https://stackoverflow.com/a/6234804/316944
function escape(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const StyledMessage = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-areas:
    "avatar username"
    "avatar content";
  grid-template-rows: auto 1fr;
  grid-template-columns: 56px 1fr;
  
  font: normal 16px/1.375 Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
  
  padding: 2px 48px 2px 16px;
  
  ${props => props.theme === "dark" && css`
    background-color: ${DARK_MODE_BG};
    color: ${DARK_MODE_TEXT};
  `}
  
  ${props => props.theme === "light" && css`
    background-color: ${LIGHT_MODE_BG};
    color: ${LIGHT_MODE_TEXT};
  `}
`;

const Avatar = styled.div`
  grid-area: avatar;
  
  img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 2px;
  }
`;

const Username = styled.div`
  grid-area: username;
  font-weight: 700;
`;

const Content = styled.div`
  grid-area: content;
  
  .d-emoji {
    width: 24px;
    vertical-align: -5px;
  }

  a {
    color: hsl(197, 80%, 47.8%);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

type MentionableUser = {
  id: APIUser["id"],
  username: APIUser["username"],
};

type MentionableChannel = {
  id: APIChannel["id"],
  name: APIChannel["name"],
};

type MentionableRole = {
  id: APIRole["id"],
  name: APIRole["name"],
};

export type MessageProps = {
  theme: "dark" | "light",
  data: MessageData,
  merged: boolean,

  idToUser: (id: string) => MentionableUser | null,
  idToChannel: (id: string) => MentionableChannel | null,
  idToRole: (id: string) => MentionableRole | null,
};

const defaultProps = extendType<Partial<MessageProps>>()({
  theme: "dark",
  merged: false,
  idToUser: () => null,
  idToChannel: () => null,
  idToRole: () => null,
});
type RequiredMessageProps = RequiredWithDefaults<MessageProps, typeof defaultProps>;

export function Message(props: RequiredMessageProps) {
  const { data, theme, merged, idToUser, idToChannel, idToRole } = { ...defaultProps, ...props } as MessageProps;

  let avatarUrl: string | null = null;
  if (data.author.avatar?.startsWith("http")) {
    avatarUrl = data.author.avatar;
  } else if (data.author.avatar && data.author?.id) {
    // https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
    avatarUrl = `https://cdn.discordapp.com/avatars/${data.author.id}/${data.author.avatar}.png`;
  } else if (data.author.discriminator) {
    // See notes at https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
    const mod = parseInt(data.author.discriminator, 10) % 5;
    avatarUrl = `https://cdn.discordapp.com/embed/avatars/${mod}.png`;
  }

  const [renderedContent, setRenderedContent] = useState<string>("");
  useEffect(() => {
    const rendered = discordMarkdownToHTML(data.content, {
      discordCallback: {
        user: ({ id }) => escape(`@${idToUser(id)?.username ?? id}`),
        channel: ({ id }) => escape(`@${idToChannel(id)?.name ?? id}`),
        role: ({ id }) => escape(`@${idToRole(id)?.name ?? id}`),
      },
    });
    setRenderedContent(rendered);
  }, [data.content]);

  return <StyledMessage theme={theme}>
    {!merged && <>
      <Username>{data.author.username}</Username>
      <Avatar>
        {avatarUrl && (
          <img src={avatarUrl} alt={`${data.author.username}'s Avatar`} />
        )}
      </Avatar>
    </>}
    <Content>
      <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
    </Content>
  </StyledMessage>;
}
