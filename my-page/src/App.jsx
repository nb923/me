import { useState } from "react";

import "./App.css";

import { AuroraText } from "@/components/magicui/aurora-text";
import { AnimatePresence, motion } from "framer-motion";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Pointer } from "@/components/magicui/pointer";


function App() {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const words = ["Nideesh", "Website"];

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
                  className="inline-block mr-4"
                  variants={wordVariants}
                  transition={{ duration: 0.5, ease: "easeIn" }}
                >
                  {word === "Website" ? (
                    <AuroraText>Website</AuroraText>
                  ) : (
                    <p>{word}</p>
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <TextAnimate className="text-2xl" delay={1.5}>
              Click above to learn more
            </TextAnimate>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-y-8"
          >
            <p>temp</p>
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
