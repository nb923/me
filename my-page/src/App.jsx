import { useState } from "react";

import "./App.css";

import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatePresence, motion } from "framer-motion";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Pointer } from "@/components/magicui/pointer";
import { Textarea } from "./components/ui/textarea";
import { Send, File as LucideFile } from "lucide-react";
import { Button } from "./components/ui/button";
import { ShinyButton } from "./components/magicui/shiny-button";
import { GridPattern } from "@/components/magicui/grid-pattern";

import { cn } from "./lib/utils";

function App() {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [text, setText] = useState("");
  const words = ["Nideesh", "GPT"];
  const prompts = ["Summarize my background in 3–5 sentences. Include my education, relevant work experience, notable projects, and any competitions or awards I’ve earned. Focus on giving a clear and concise picture of who I am professionally.", "Compare me to other candidates at a similar stage in their career. Research typical skills, experience, or accomplishments for someone in my field and provide statistics or examples and compare them to me in topics such as technical skills, project depth, awards, or leadership roles.", "Based on the job description below, explain my fit for this role. Focus on alignment with required skills, past experience, and potential contributions.\n\nJob Description:\n[Paste job description here]", "Share a lighthearted or surprising fact about me. Make it authentic and memorable, something that could spark a conversation.", "List 5–7 of my favorite songs. Include a variety of genres or moods if possible, and keep it casual and reflective of my personality."];

  function handleTextChange(e) 
  {
    setText(e.target.value);
  }

  console.log(text);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-8 relative bg-blue-50">
      <GridPattern
        width={70}
        height={70}
        x={-1}
        y={-1}
        className={cn("fixed inset-0 -z-10 w-full h-full")}
      />
      <motion.div
        className="absolute w-70 h-70 bg-blue-300 rounded-full blur-lg top-[30%] left-[85%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute w-50 h-50 bg-purple-300 rounded-full blur-lg top-[80%] left-[20%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>{" "}
      <motion.div
        className="absolute w-60 h-60 bg-green-300 rounded-full blur-2xl top-[80%] left-[90%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute w-30 h-30 bg-pink-300 rounded-full blur-lg top-[40%] left-[10%] transform -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>{" "}
      <AnimatePresence mode="wait">
        {isIntroVisible ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-y-8"
          >
            <motion.h1
              layout
              className="text-5xl font-bold tracking-tighter md:text-7xl lg:text-9xl text-center transform transition-transform duration-300 ease-in-out hover:scale-105 flex justify-center"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              onClick={() => setIsIntroVisible(false)}
            >
              {words.map((word, idx) => (
                <motion.span
                  layout
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

            <TextAnimate className="text-2xl text-gray-700" delay={1.5}>
              Click above to learn more, if you want ¯\_(ツ)_/¯
            </TextAnimate>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className="flex flex-col items-center gap-y-8"
          >
            <h1
              className="text-3xl font-bold tracking-tighter md:text-3xl lg:text-6xl text-center flex justify-center"
              onClick={() => setIsIntroVisible(false)}
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
            <div className="flex flex-col">
              <div className="flex flex-row">
                <Textarea
                  className="h-20 w-150 text-left resize-none scrollbar-thin scroll-smooth cursor-none border-gray-300 text-[rgb(0,0,0,75%)] bg-white"
                  placeholder="Ask me anything... this agent knows my resume better than I do"
                  value = {text}
                  onChange = {handleTextChange}
                />
                <div className="flex flex-col ml-2 space-y-2">
                  <Button className="h-9 w-9 bg-blue-500 border border-blue-500 cursor-none transform transition-transform duration-100 hover:scale-110 hover:bg-blue-500">
                    <Send size={24} />
                  </Button>
                  <Button className="h-9 w-9 bg-white border border-gray-300 cursor-none transform transition-transform duration-100 hover:scale-110 hover:bg-white">
                    <LucideFile size={24} color="black" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center pt-8 space-x-4">
                <ShinyButton variant="outline" className="cursor-none rounded-3xl bg-white" onClick={() => setText(prompts[0])}>
                  Summarize my experience
                </ShinyButton>
                <ShinyButton variant="outline" className="cursor-none rounded-3xl bg-white" onClick={() => setText(prompts[1])}>
                  Compare me to peers
                </ShinyButton>
              </div>
              <div className="flex justify-center pt-2 space-x-4">
                <ShinyButton variant="outline" className="cursor-none rounded-3xl bg-white" onClick={() => setText(prompts[2])}>
                  Explain my role fit
                </ShinyButton>
                <ShinyButton variant="outline" className="cursor-none rounded-3xl bg-white" onClick={() => setText(prompts[3])}>
                  Share a fun fact about me
                </ShinyButton>
                <ShinyButton variant="outline" className="cursor-none rounded-3xl bg-white" onClick={() => setText(prompts[4])}>
                  List my favorite songs
                </ShinyButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Pointer>
        <div className="text-2xl">👆</div>
      </Pointer>
    </div>
  );
}

export default App;

/*

, if you want ¯\_(ツ)_/¯

*/
