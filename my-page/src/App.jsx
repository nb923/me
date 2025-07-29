import { useState } from "react";

import "./App.css";

import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatePresence, motion } from "framer-motion";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Pointer } from "@/components/magicui/pointer";
import { Textarea } from "./components/ui/textarea";
import { Send, File as LucideFile } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const words = ["Nideesh", "GPT"];

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-8">
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

            <TextAnimate className="text-2xl" delay={1.5}>
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
              className="text-3xl font-bold tracking-tighter md:text-3xl lg:text-5xl text-center flex justify-center"
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
            <div className="flex flex-row">
              <Textarea
                className="h-20 w-150 text-left resize-none scrollbar-thin scroll-smooth cursor-none"
                placeholder="Ask me anything... this agent knows my resume better than I do"
              />
              <div className="flex flex-col ml-2 space-y-2">
                <Button className="h-9 w-9 bg-blue-500 border border-blue-500 cursor-none transform transition-transform duration-100 hover:scale-110 hover:bg-blue-500"><Send size={24}/></Button>
                <Button className="h-9 w-9 bg-gray-100 border border-gray-300 cursor-none transform transition-transform duration-100 hover:scale-110 hover:bg-gray-100"><LucideFile size={24} color="black"/></Button>
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
