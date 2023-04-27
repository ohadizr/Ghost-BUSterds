import React from "react";
import { createWorker } from "tesseract.js";
import bus from "../assets/phoneImages/040117_egged.jpg";
import { useState } from "react";

export default function Tesseract() {
  const [input, setInput] = useState("");
  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(bus);
    console.log(text);
    setInput(text);
    await worker.terminate();
  })();
  return <div>{input}</div>;
}
