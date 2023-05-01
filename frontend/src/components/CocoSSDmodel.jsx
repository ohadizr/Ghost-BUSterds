import { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";
import DisplayDetectedImgs from "./DisplayDetectedImgs.jsx";
import { saveAs } from "file-saver";
import * as tf from "@tensorflow/tfjs";
import Tesseract from "./tesseract";
import T from "tesseract.js";
import bus from "../assets/phoneImages/040117_egged.jpg";
const fps = 10;

export default function CocoSSModel() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [phoneImagesArray, setPhoneImagesArray] = useState([]);

  const runCoco = async () => {
    await tf.setBackend("webgl");

    const net = await cocoSsd.load();

    setInterval(() => {
      detect(net);
    }, 1000 / fps);
  };

  const detect = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const objects = await net.detect(video);

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        ctx.clearRect(0, 0, videoWidth, videoHeight);
        drawRect(objects, ctx, videoWidth, videoHeight);
      }

      objects.forEach((prediction) => {
        if (prediction.class === "cell phone") {
          HandleCellPhoneDetection(net, prediction);
        }
      });
    }
  };

  async function HandleCellPhoneDetection(net, prediction) {
    const [x, y, width, height] = prediction["bbox"];
    const timestamp = new Date().toLocaleTimeString();
    console.log(`Cell Phone detected at ${timestamp}`);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      webcamRef.current.video,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    const dataUrl = canvas.toDataURL("image/png");

    setPhoneImagesArray((prevPhoneImagesArray) => [
      ...prevPhoneImagesArray,
      dataUrl,
    ]);

    console.log("Step 2 - Cell phone confirmed");
  }
  async function tesseract() {
    let imgtocheck = "https://i.ytimg.com/vi/H7Nj2axPlXk/maxresdefault.jpg";
    T.recognize(imgtocheck, "eng", { logger: (e) => console.log(e) })
      .then((out) => {
        const text = out.data.text;
        // const numbersOnly = text.replace(/\D/g, "");
        // console.log(numbersOnly);
        console.log(text);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    // tesseract();

    runCoco();
  }, []);

  return (
    <div>
      <h1>Object detection using COCO-SSD model</h1>
      <Webcam
        ref={webcamRef}
        muted={true}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 12,
          width: 420,
          height: 320,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 12,
          width: 420,
          height: 320,
        }}
      />
      <DisplayDetectedImgs phoneImagesArray={phoneImagesArray} />
      {/* <Tesseract /> */}
    </div>
  );
}
