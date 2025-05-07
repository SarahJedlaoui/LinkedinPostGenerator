"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const swipeConfidenceThreshold = 100;

const cardVariants = {
  initial: { x: 0, opacity: 1, rotate: 0 },
  swipeLeft: { x: -300, opacity: 0, rotate: -10 },
  swipeRight: { x: 300, opacity: 0, rotate: 10 },
};

export default function SwipeableCard({ questions, index, setIndex }) {
    const controls = useAnimation();
  
    const handleDragEnd = async (_, info) => {
      const offset = info.offset.x;
      if (Math.abs(offset) < 100) {
        await controls.start("initial");
        return;
      }
  
      const direction = offset > 0 ? "swipeRight" : "swipeLeft";
  
      if (direction === "swipeRight" && index === 0) return;
      if (direction === "swipeLeft" && index === questions.length - 1) return;
  
      await controls.start(direction);
      setIndex(direction === "swipeRight" ? index - 1 : index + 1);
      await controls.start("initial");
    };

  return (
    <div className="w-full flex justify-center mt-8 relative h-[480px]">
      {/* 👇 Hint of next cards under the current card */}
      {[1, 2].map((layer) => {
        const show = index + layer < questions.length;
        if (!show) return null;

        return (
          <div
            key={layer}
            className="absolute top-0 left-0 right-0 flex justify-center"
            style={{
              transform: `translateY(${layer * 8}px) scale(${1 - layer * 0.02})`,
              zIndex: layer * -1,
              opacity: 0.6,
            }}
          >
            <div className="bg-[#D96C4F] w-[80%] max-w-md min-h-[460px] rounded-lg shadow-md" />
          </div>
        );
      })}

      {/* 👆 Active swipeable card */}
      <motion.div
        className="bg-[#D96C4F] text-white px-6 py-10 rounded-lg w-[80%] max-w-md text-center shadow-xl cursor-grab active:cursor-grabbing relative z-10"
        style={{
          minHeight: "460px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        initial="initial"
        animate={controls}
        variants={cardVariants}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        <p className="text-base text-white/80 mb-3">Today’s Question</p>
        <h2 className="text-xl font-bold leading-tight text-justify">
          {questions[index]}
        </h2>
        <p className="text-sm mt-6 text-white/60">Swipe to change question</p>
      </motion.div>
    </div>
  );
}
