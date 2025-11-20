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
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

const Home = () => {
  const { refresh } = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollingStation, setPollingStation] = useLocalStorage(
    "pollingStation",
    []
  );

  const handleSetPollingStation = (psNo) => {
    if (pollingStation.includes(psNo)) {
      setPollingStation(pollingStation.filter((num) => num !== psNo));
    } else {
      setPollingStation([...pollingStation, psNo]);
    }
  };

  const { messages, sendMessage, status, regenerate, stop } = useChat({
    onFinish: () => {
      setLoading(false);
      setText("");
    },
  });
  console.log(`🚀 ~ Home ~ messages:`, messages);

  const handleSubmit = () => {
    setLoading(true);
    sendMessage({
      text,
      files: pollingStation.map((psNo) => ({
        type: "file",
        url: `https://www.eci.gov.in/sir/f2/S12/data/OLDSIRROLL/S12/219/S12_219_${psNo}.pdf`,
        mediaType: "application/pdf",
      })),
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
              {psNo}- RATLAM <XIcon className="size-3" />
            </Badge>
          ))}
        </div>
        <div className="flex items-start justify-start gap-2">
          <Label>Polling Stations (Total: 161)</Label>
          <div className="overflow-x-auto flex gap-2 w-full pb-4">
            {Array.from({ length: 161 }, (_, i) => i + 1).map((psNo) => (
              <Button
                size={"icon"}
                key={psNo}
                variant={pollingStation.includes(psNo) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleSetPollingStation(psNo)}
              >
                {psNo}
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
