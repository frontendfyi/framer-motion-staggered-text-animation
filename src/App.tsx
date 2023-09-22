import "./index.css";
import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

function App() {
  return (
    <main className="mx-auto mt-14 max-w-6xl text-white">
      <section className="h-screen">
        <p className="text-4xl md:text-[200px] md:leading-relaxed">
          Scroll down...
        </p>
      </section>
      <section className="flex h-[150vh] flex-col items-center justify-center">
        <AnimatedText
          once
          text="Hello you"
          className="text-[200px]"
        />
      </section>

      <section className="flex min-h-[150vh] flex-col items-center justify-center">
        <AnimatedText
          text={[
            "This is written on",
            "a typing machine. Tick tick",
            "tick tack tack...",
          ]}
          className="text-4xl"
          repeatDelay={10000}
        />
      </section>
    </main>
  );
}

type AnimatedTextProps = {
  text: string | string[];
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  repeatDelay?: number;
};

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
  once,
  repeatDelay,
}: AnimatedTextProps) => {
  const controls = useAnimation();
  const textArray = Array.isArray(text) ? text : [text];
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const show = () => {
      controls.start("visible");
      if (repeatDelay) {
        timeout = setTimeout(async () => {
          await controls.start("hidden");
          controls.start("visible");
        }, repeatDelay);
      }
    };

    if (isInView) {
      show();
    } else {
      controls.start("hidden");
    }

    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        aria-hidden
      >
        {textArray.map((line) => (
          <span className="block">
            {line.split(" ").map((word) => (
              <span className="inline-block">
                {word.split("").map((char) => (
                  <motion.span
                    className="inline-block"
                    variants={defaultAnimations}
                  >
                    {char}
                  </motion.span>
                ))}
                <span className="inline-block">&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

export default App;