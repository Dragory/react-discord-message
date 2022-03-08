import React from "react";
import ReactDOM from "react-dom";
import { MessageList, MessageData, Theme } from "../../src/index.js";
import styled from "styled-components";

const StyledMessageList = styled(MessageList)`
  border-radius: 8px;
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.15);
`;

const Pane = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  
  @media screen and (min-width: 1024px) {
    flex: 0 0 50%;
    padding: 64px;
  }

  ${StyledMessageList} {
    width: 100%;
  }
`;

const DarkModePane = styled(Pane)`
  background-color: #2f3136;
`;

const LightModePane = styled(Pane)`
  background-color: #f2f3f5;
`;

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1024px) {
    min-height: 100%;
    flex-direction: row;
  }
`;

function createTestData(theme: Theme): MessageData[] {
  return [
    {
      content: "Hello there!",
      author: {
        id: "0",
        username: "Dragory",
        discriminator: "0001",
      },
    },
    {
      content: `This is a ${theme} mode example.`,
      author: {
        id: "0",
        username: "Dragory",
        discriminator: "0001",
      },
    },
    {
      content: `Can you show me something more complex?`,
      author: {
        id: "1",
        username: "DiscordUser123",
        discriminator: "0002",
      },
    },
    {
      content: "Sure! **Here** *is* __some__ ~~markdown~~. Also `code`. And attachments and embeds:\n\n...ahem, TODO.",
      author: {
        id: "0",
        username: "Dragory",
        discriminator: "0001",
      },
    },
  ];
}

const darkModeExamples = createTestData("dark");
const lightModeExamples = createTestData("light");

function App() {
  return <StyledApp>
    <DarkModePane>
      <StyledMessageList messages={darkModeExamples} theme="dark" />
    </DarkModePane>
    <LightModePane>
      <StyledMessageList messages={lightModeExamples} theme="light" />
    </LightModePane>
  </StyledApp>;
}

ReactDOM.render(<App />, document.getElementById("root"));
