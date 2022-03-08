# `@mivir/react-discord-message`
React component for rendering Discord messages.
Uses the excellent [discord-markdown](https://www.npmjs.com/package/discord-markdown) package for rendering Discord markdown.
Comes with full TypeScript types based on [discord-api-types](https://www.npmjs.com/package/discord-api-types).

[**OPEN DEMO**](https://dragory.github.io/discord-message-react/)

## Roadmap
This library is currently a work in progress.
- [X] Message text content rendering
- [X] Dark/light theme
- [X] Message grouping logic
- [ ] Embeds
- [ ] Attachments

## Installation

```shell
npm install @mivir/react-discord-message
```

## Usage

```jsx
import { MessageList } from "@mivir/react-discord-message"

const messages = [
  {
    content: "Hello world!",
    author: {
      username: "DiscordUser",
    },
  },
];

<MessageList messages={messages} theme="dark" />
```

You can also check [the source for the demo above](/docs/src/docs.tsx) for a more detailed example.
