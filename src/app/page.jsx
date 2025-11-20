"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useChat } from "@ai-sdk/react";
import { MessageSquareIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { Fragment, useState } from "react";

const Home = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollingStation, setPollingStation] = useLocalStorage(
    "polling-st-rtm",
    []
  );

  const handleSetPollingStation = (psNo) => {
    const exists = pollingStation.find((ps) => ps.label === psNo.label);
    if (exists) {
      const updated = pollingStation.filter((ps) => ps.label !== psNo.label);
      setPollingStation(updated);
    } else {
      setPollingStation([...pollingStation, psNo]);
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  const { messages, sendMessage, status, regenerate } = useChat({
    onFinish: () => {
      setLoading(false);
      setText("");
    },
  });

  const handleSubmit = () => {
    setLoading(true);
    sendMessage({
      text,
      ...(messages.length
        ? {}
        : {
            files: pollingStation.map((psNo) => ({
              type: "file",
              url: psNo.url,
              mediaType: "application/pdf",
              filename: `${psNo.label}-Ratlam.pdf`,
            })),
          }),
    });
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <div className="flex gap-2 flex-col pb-2">
        <div className="flex flex-wrap gap-2 shrink-0">
          <Badge variant={"secondary"} className={"shrink-0"}>
            Madhya Pradesh
          </Badge>
          <Badge variant={"secondary"} className={"shrink-0"}>
            Ratlam - 43
          </Badge>
          <Badge variant={"secondary"} className={"shrink-0"}>
            Ratlam (City) - 219
          </Badge>
        </div>
        <div className="flex overflow-x-auto w-full pb-4 gap-2 mt-2 ">
          {pollingStation.map((psNo) => (
            <Badge
              size={"icon"}
              key={psNo}
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => handleSetPollingStation(psNo)}
            >
              {psNo.label}- RATLAM <XIcon className="size-3" />
            </Badge>
          ))}
        </div>
        <div className="flex items-start justify-start gap-2">
          <Label>Polling Stations (Total: 161)</Label>
          <div className="overflow-x-auto flex gap-2 w-full pb-4">
            {[
              {
                label: "52",
                url: "https://8f5yg79wnw.ufs.sh/f/SUFb4V4OYNdFB8QaTxzWadUQ9T1nGtpBEhJfRqVKbmXec5YI",
              },
              // "53","54","55",
              {
                label: "53",
                url: "https://8f5yg79wnw.ufs.sh/f/SUFb4V4OYNdFRbTmPuX8XU5tWnbjodpuD7lyqS46mzKk1Ixv",
              },
              {
                label: "54",
                url: "https://8f5yg79wnw.ufs.sh/f/SUFb4V4OYNdFalBhLAVyDCBREn1AOvY45QeNWImuUtihHbpk",
              },
              {
                label: "55",
                url: "https://8f5yg79wnw.ufs.sh/f/SUFb4V4OYNdFSU8bCgBOYNdF7AHelIrD1fUTVjR3MLoZ6a2B",
              },
            ].map((psNo) => (
              <Button
                size={"icon"}
                key={psNo.label}
                variant={
                  pollingStation.filter((p) => p.label === psNo.label).length
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleSetPollingStation(psNo)}
              >
                {psNo.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Conversation className="relative size-full">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Messages will appear here as the conversation progresses."
              icon={<MessageSquareIcon className="size-6" />}
              title="Find Voter Details"
            />
          ) : (
            messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      const isLastMessage =
                        messageIndex === messages.length - 1;
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" && isLastMessage && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </Fragment>
            ))
          )}
          {loading && (
            <Message from="assistant">
              <MessageContent>
                <div className="flex items-center gap-2">
                  <Spinner />
                  Finding voter details...
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <div className="w-full px-4 pb-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(event) => setText(event.target.value)}
                value={text}
                placeholder="Find a voter..."
              />
            </PromptInputBody>
            <PromptInputFooter className={"items-center justify-between gap-4"}>
              <Button onClick={refresh} variant={"outline"} type="button">
                Restart Chat
              </Button>
              {loading && <div>Fetching...</div>}
              <PromptInputSubmit
                disabled={!text.trim().length}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default Home;
