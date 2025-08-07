import React, { useState, useRef, useEffect } from "react";

import "./App.css";
import ReactMarkdown from "react-markdown";
import { MarkdownTypewriter } from "react-markdown-typewriter";

import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatePresence, motion } from "framer-motion";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Pointer } from "@/components/magicui/pointer";
import { Textarea } from "./components/ui/textarea";
import {
  Send,
  File,
  Linkedin,
  Github,
  Paperclip,
  Settings,
  FileText,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { ShinyButton } from "./components/magicui/shiny-button";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "./lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Switch } from "./components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Card } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

function App() {
  const HUMANMESSAGE = 1;
  const AIMESSAGE = 0;

  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const fileInputDummy = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isChatWritten, setIsChatWritten] = useState(true);
  const [charsAnimated, setCharsAnimated] = useState(0);
  const audioRef = useRef(null);
  const chatEndRef = useRef(null);

  const words = ["Nideesh", "GPT"];
  const prompts = [
    "Can you summarize Nideesh’s background in 3–5 sentences? I'm looking for a clear snapshot of his education, work experience, notable projects, and any awards or competitions he's been part of. Something that gives me a quick but strong sense of his professional profile.",

    "How does Nideesh compare to other candidates at a similar stage in their career? Include data or typical benchmarks for skills, experience, or accomplishments in his field, and describe where he currently stands relative to those.",

    "Here’s a job description — based on this, how does Nideesh’s background align with the requirements and expectations? Describe where his experience matches and where there may be gaps.\n\nJob Description:\n[Paste job description here]",

    "Tell me a fun or surprising fact about Nideesh — something authentic that reflects his personality or sparks curiosity. Could be a hobby, unusual experience, or just something memorable that breaks the ice.",

    "What are some of Nideesh’s favorite songs? Share 5–7 tracks across different genres or moods if you can — I want to get a casual sense of his personality through the kind of music he enjoys.",
  ];
  
  const [messages, setMessages] = useState([]);

  function handleChangeToMain() {
    setIsIntroVisible(false);
  }

  function handleTextChange(e) {
    if (e.target.value.length <= 1500) {
      setText(e.target.value);
    }
  }

  function handleFileClick() {
    if (fileInputDummy.current) {
      fileInputDummy.current.value = null;
    }

    fileInputDummy.current.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type != "application/pdf") {
      alert("Please upload a PDF.");
      return;
    }

    setFile(file);
    setFileName(file.name);
  }

  function handleMusicToggle() {
    setMusicOn((prev) => {
      if (prev) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }

      return !prev;
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleTextSubmit() {
    if (text) {
      let sent = text;

      setIsChatMode(true);
      setIsChatWritten((prev) => !prev);
      setText("");
      setIsChatLoading((prev) => !prev);
      setFile(null);

      let formatSent = [HUMANMESSAGE, sent];

      setMessages((prev) => [...prev, formatSent]);

      await sleep(2000);

      let response = [
        AIMESSAGE,
        `# About Nideesh

**Nideesh** is a passionate learner and problem solver with a strong interest in technology and innovation. He enjoys tackling challenging projects that combine creativity and practical impact.

---

## Key Traits
- Curious and always eager to learn
- Focused on building meaningful solutions
- Embraces collaboration and growth

> _“Innovation distinguishes between a leader and a follower.”_ — Steve Jobs

---

### Interests
- Software development
- Creative problem solving
- Exploring new technologies

---

Feel free to connect with Nideesh to learn more about his journey and projects!`,
      ];

      setMessages((prev) => [...prev, response]);

      setIsChatLoading(false);
    }
  }

  function MessageBubble({ message, messageIndex }) {
    let type = message[0];
    let text = message[1];
    let lastMessage = messages.length == messageIndex + 1;

    if (type == HUMANMESSAGE) {
      return (
        <>
          <div className="relative flex justify-end pr-2">
            <Card className="w-fit h-fit px-7 py-4 bg-blue-100 4xl:px-12 4xl:py-6 4xl:border-4 4xl:rounded-3xl">
              <article className="prose prose-sm 4xl:prose-2xl">
                <ReactMarkdown>{text}</ReactMarkdown>
              </article>
            </Card>
          </div>
          {lastMessage && isChatLoading && (
            <div className="relative pl-2">
              <Card className="w-fit h-fit px-7 py-4 4xl:px-12 4xl:py-6 4xl:border-4 4xl:rounded-3xl">
                <article className="prose prose-sm 4xl:prose-2xl">
                  <ReactMarkdown>Generating...</ReactMarkdown>
                </article>
              </Card>
              <div className="absolute -top-3 -left-4 4xl:-top-5 4xl:-left-6 *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
                <Avatar className="w-10 h-10 4xl:w-17 4xl:h-17">
                  <AvatarImage src="./src/assets/avatarimage.jpg" />
                  <AvatarFallback>NBK</AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}
        </>
      );
    } else if (type == AIMESSAGE) {
      return (
        <div className="relative pl-2">
          <Card className="w-fit h-fit px-7 py-4 4xl:px-12 4xl:py-6 4xl:border-4 4xl:rounded-3xl">
            <article className="prose prose-sm 4xl:prose-2xl">
              {!lastMessage ? (
                <ReactMarkdown>{text}</ReactMarkdown>
              ) : isChatLoading ? (
                <></>
              ) : !isChatWritten ? (
                <MarkdownTypewriter
                  motionProps={{
                    onAnimationComplete: () =>
                      setIsChatWritten((prev) => !prev),
                  }}
                >
                  {text}
                </MarkdownTypewriter>
              ) : (
                <ReactMarkdown>{text}</ReactMarkdown>
              )}
            </article>
          </Card>
          <div className="absolute -top-3 -left-4 4xl:-top-5 4xl:-left-6 *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
            <Avatar className="w-10 h-10 4xl:w-17 4xl:h-17">
              <AvatarImage src="./src/assets/avatarimage.jpg" />
              <AvatarFallback>NBK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      );
    }

    return <></>;
  }

  useEffect(() => {
    audioRef.current?.play().catch(() => {
      const catchInteract = () => {
        audioRef.current?.play();
        document.removeEventListener("mousemove", catchInteract);
      };

      document.addEventListener("mousemove", catchInteract, { once: true });
    });
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.7,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const gridDimensions = window.innerWidth < 2560 ? 70 : 140;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-8 relative bg-blue-50/50 overflow-hidden">
      <GridPattern
        width={gridDimensions}
        height={gridDimensions}
        x={-1}
        y={-1}
        className={cn("fixed inset-0 -z-10 w-full h-full")}
      />
      <motion.div
        className="absolute -z-10 w-70 h-70 4xl:w-110 4xl:h-110 4xl:blur-xl bg-blue-400 rounded-full blur-lg top-[30%] left-[85%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute -z-10 w-50 h-50 4xl:w-90 4xl:h-90 4xl:blur-2xl bg-purple-400 rounded-full blur-lg top-[80%] left-[20%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute -z-10 w-60 h-60 4xl:w-100 4xl:h-100 4xl:blur-2xl bg-green-400 rounded-full blur-2xl top-[80%] left-[90%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute -z-10 w-30 h-30 4xl:w-70 4xl:h-70 4xl:blur-2xl bg-pink-400 rounded-full blur-lg top-[40%] left-[10%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <AnimatePresence mode="wait">
        {isIntroVisible ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-y-8 4xl:gap-y-20"
          >
            <motion.h1
              className="text-5xl font-bold tracking-tighter md:text-7xl lg:text-9xl 4xl:text-[14rem] text-center transform transition-transform duration-300 ease-in-out hover:scale-105 flex justify-center"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              onClick={() => handleChangeToMain()}
            >
              {words.map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block mr-2"
                  variants={wordVariants}
                  transition={{ duration: 0.5, ease: "easeIn" }}
                >
                  {word === "GPT" ? (
                    <AuroraText>{word}</AuroraText>
                  ) : (
                    <p>{word}</p>
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <TextAnimate
              className="md:text-2xl text-gray-700 lg:text-xl 4xl:text-4xl"
              delay={2.2}
            >
              Click above to learn more, if you want ¯\_(ツ)_/¯
            </TextAnimate>
          </motion.div>
        ) : (
          <>
            <audio
              ref={audioRef}
              src="https://hollow-knight-bucket.s3.us-east-2.amazonaws.com/vibe.mp3"
              autoPlay
              loop
              preload="auto"
            />
            <a
              href="https://www.linkedin.com/in/bknideesh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="fixed top-4 left-4 4xl:top-8 4xl:left-8 4xl:pt-9 4xl:pb-9 4xl:pl-8 4xl:pr-8 4xl:rounded-2xl 4xl:text-[1.7rem] cursor-none bg-[#008FD6] hover:scale-105 hover:opacity-80 hover:bg-[#008FD6] hover:shadow-2xl animate-in fade-in-0 slide-in-from-top-20 duration-500">
                <span className="flex flex-row space-x-4 4xl:space-x-8 items-center">
                  <Linkedin
                    strokeWidth={2}
                    className="h-4 w-4 4xl:h-8 4xl:w-8"
                  />
                  <p>Connect on LinkedIn</p>
                </span>
              </Button>
            </a>
            <a
              href="https://github.com/nb923"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="fixed top-4 left-55 4xl:top-8 4xl:left-110 4xl:pt-9 4xl:pb-9 4xl:pl-8 4xl:pr-8 4xl:rounded-2xl 4xl:text-[1.7rem] cursor-none bg-gray-800 hover:scale-105 hover:opacity-80 hover:bg-gray-800 hover:shadow-2xl animate-in fade-in-0 slide-in-from-top-20 duration-500">
                <span className="flex flex-row space-x-4 items-center">
                  <Github strokeWidth={2} className="h-4 w-4 4xl:h-8 4xl:w-8" />
                  <p>View GitHub</p>
                </span>
              </Button>
            </a>
            <a
              href="./files/nbk-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="fixed top-4 right-4 4xl:top-8 4xl:right-8 4xl:pt-9 4xl:pb-9 4xl:pl-8 4xl:pr-8 4xl:rounded-2xl 4xl:text-[1.7rem] cursor-none bg-blue-500 hover:scale-105 hover:opacity-80 hover:bg-blue-500 hover:shadow-2xl animate-in fade-in-0 slide-in-from-top-20 duration-500">
                <span className="flex flex-row space-x-4 items-center">
                  <File strokeWidth={2} className="h-4 w-4 4xl:h-8 4xl:w-8" />
                  <p>Resume</p>
                </span>
              </Button>
            </a>
            <Popover>
              <PopoverTrigger asChild className="4xl:border-2">
                <Button
                  variant="outline"
                  className="fixed bottom-4 left-4 4xl:bottom-8 4xl:left-8 4xl:p-8 4xl:pl-16 4xl:pr-16 4xl:text-[1.7rem] cursor-none rounded-full animate-in fade-in-0 slide-in-from-top-20 duration-500"
                >
                  <Settings className="h-4 w-4 4xl:h-8 4xl:w-8 4xl:m-10 4xl:ml-2 4xl:mr-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-80 ml-0 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2"
                sideOffset={5}
                alignOffset={0}
              >
                <div className="4xl:border-2 gap-4 p-4 rounded-2xl border bg-background shadow-xs flex flex-col w-49 4xl:w-90 4xl:p-8 4xl:rounded-4xl 4xl:gap-8">
                  <span className="flex items-center space-x-2 4xl:space-x-4">
                    <Switch
                      className="data-[state=checked]:bg-blue-500 cursor-none"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                    <Label className="text-sm 4xl:text-[1.7rem] cursor-none relative bottom-[2px]">
                      Dark Mode TBD
                    </Label>
                  </span>
                  <span className="flex items-center space-x-2 4xl:space-x-4">
                    <Switch
                      className="data-[state=checked]:bg-blue-500 cursor-none"
                      checked={musicOn}
                      onCheckedChange={handleMusicToggle}
                    />
                    <Label className="text-sm 4xl:text-[1.7rem] cursor-none relative bottom-[2px]">
                      <a
                        href="https://www.youtube.com/watch?v=_Q8Ih2SW-TE"
                        className="cursor-none text-blue-500 underline underline-offset-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Music
                      </a>
                      Toggle
                    </Label>
                  </span>
                </div>
              </PopoverContent>
            </Popover>
            {isChatMode && (
              <div className="fixed top-14 bottom-35 w-221 4xl:w-401 4xl:top-30 4xl:bottom-70 overflow-y-auto pl-8 py-1 scrollbar-none space-y-8 -translate-x-5 text-base">
                {messages.map((item, i) => (
                  <MessageBubble key={i} message={item} messageIndex={i} />
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
            <motion.div
              layout="position"
              key="main"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                layout: { duration: 1, ease: "easeInOut" },
              }}
              className={`flex flex-col items-center gap-y-8 4xl:gap-y-14 ${
                isChatMode && !file ? "fixed -bottom-26 4xl:-bottom-47" : ""
              }
              
              ${isChatMode && file ? " fixed -bottom-21 4xl:-bottom-42" : ""}
              `}
            >
              {
                <h1
                  onClick={() => setIsIntroVisible(false)}
                  className={`text-3xl font-bold tracking-tighter md:text-3xl lg:text-6xl 4xl:text-9xl text-center flex justify-center ${
                    isChatMode
                      ? "opacity-0 pointer-events-none overflow-hidden"
                      : "opacity-100 h-auto"
                  }`}
                >
                  {words.map((word, idx) => (
                    <motion.span
                      layout
                      key={idx}
                      className="inline-block mr-1.5"
                      variants={wordVariants}
                      transition={{ duration: 0.5, ease: "easeIn" }}
                    >
                      {word === "GPT" ? (
                        <AuroraText>{word}</AuroraText>
                      ) : (
                        <p>{word}</p>
                      )}
                    </motion.span>
                  ))}
                </h1>
              }
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <Textarea
                    disabled={!isChatWritten}
                    className="h-20 w-200 4xl:w-370 4xl:h-40 4xl:text-[1.7rem] 4xl:rounded-2xl 4xl:p-4 4xl:pl-6 text-left resize-none scrollbar-thin scroll-smooth cursor-none border-gray-300 4xl:border-2 text-[rgb(0,0,0,75%)] bg-white"
                    placeholder="Ask me anything... this agent knows my resume better than I do"
                    value={text}
                    onChange={handleTextChange}
                  />
                  <div className="flex flex-col ml-2 space-y-2 4xl:space-y-4 4xl:ml-4">
                    <Button
                      onClick={handleTextSubmit}
                      disabled={!isChatWritten}
                      className="h-9 w-9 4xl:w-18 4xl:h-18 4xl:rounded-2xl bg-blue-500 border border-blue-500 4xl:border-2 cursor-none transform transition-transform duration-100 hover:scale-110 hover:bg-blue-500"
                    >
                      <Send className="h-4 w-4 4xl:h-8 4xl:w-8" />
                    </Button>
                    <>
                      <Button
                        disabled={!isChatWritten}
                        className="h-9 w-9 4xl:w-18 4xl:h-18 4xl:rounded-2xl bg-white border border-gray-300 4xl:border-2 cursor-none transform transition-transform duration-100 hover:scale-110 hover:bg-white"
                        onClick={handleFileClick}
                      >
                        <Paperclip
                          className="h-4 w-4 4xl:h-8 4xl:w-8"
                          color="black"
                        />
                      </Button>
                      <input
                        type="file"
                        accept=".pdf, application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputDummy}
                        style={{ display: "none" }}
                      />
                    </>
                  </div>
                </div>
                {file && (
                  <div className="flex flex-row items-center border border-blue-300 bg-blue-100 rounded-sm pl-3 mt-1 -mb-3 4xl:pl-6 4xl:mt-2 4xl:-mb-1 4xl:pt-2 4xl:pb-2 4xl:border-2 4xl:rounded-xl w-fit animate-in fade-in-0 duration-600">
                    <div className="rounded-full bg-blue-500 h-1.5 w-1.5 mr-2 4xl:w-3 4xl:h-3 4xl:mr-4" />
                    <p className="text-[0.71rem] 4xl:text-[1.33rem] relative font-semibold text-blue-950">
                      {fileName}
                    </p>
                    <button
                      className="relative bottom-[1px] text-blue-950 cursor-none pl-2 pr-3 4xl:pl-4 4xl:pr-6 4xl:text-2xl 4xl:bottom-[3px]"
                      onClick={() => setFile(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
                {
                  <motion.div
                    layout="position"
                    className={`4xl:space-y-4 ${
                      isChatMode
                        ? "opacity-0 pointer-events-none overflow-hidden"
                        : "opacity-100 h-auto"
                    }`}
                  >
                    <div className="flex justify-center pt-8 space-x-4">
                      <ShinyButton
                        variant="outline"
                        className="cursor-none rounded-3xl bg-white 4xl:p-4 4xl:pl-12 4xl:pr-12 4xl:rounded-full 4xl:border-2"
                        onClick={() => setText(prompts[0])}
                      >
                        Summarize my experience
                      </ShinyButton>
                      <ShinyButton
                        variant="outline"
                        className="cursor-none rounded-3xl bg-white 4xl:p-4 4xl:pl-12 4xl:pr-12 4xl:rounded-full 4xl:border-2"
                        onClick={() => setText(prompts[1])}
                      >
                        Compare me to peers
                      </ShinyButton>
                    </div>
                    <div className="flex justify-center pt-2 space-x-4 4xl:space-x-8">
                      <ShinyButton
                        variant="outline"
                        className="cursor-none rounded-3xl bg-white 4xl:p-4 4xl:pl-12 4xl:pr-12 4xl:rounded-full 4xl:border-2"
                        onClick={() => setText(prompts[2])}
                      >
                        Explain my role fit
                      </ShinyButton>
                      <ShinyButton
                        variant="outline"
                        className="cursor-none rounded-3xl bg-white 4xl:p-4 4xl:pl-12 4xl:pr-12 4xl:rounded-full 4xl:border-2"
                        onClick={() => setText(prompts[3])}
                      >
                        Share a fun fact about me
                      </ShinyButton>
                      <ShinyButton
                        variant="outline"
                        className="cursor-none rounded-3xl bg-white 4xl:p-4 4xl:pl-12 4xl:pr-12 4xl:rounded-full 4xl:border-2"
                        onClick={() => setText(prompts[4])}
                      >
                        List my favorite songs
                      </ShinyButton>
                    </div>
                  </motion.div>
                }
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Pointer>
        <div className="text-2xl 4xl:text-4xl">👆</div>
      </Pointer>
    </div>
  );
}

export default App;

/*

, if you want ¯\_(ツ)_/¯

*/
