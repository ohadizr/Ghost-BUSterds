import React, { useEffect } from "react";

export default function displayDetectedImgs(props) {
  const { phoneImagesArray } = props;
  console.log(phoneImagesArray);
  // useEffect(() => {
  //     console.log(phoneImagesArray);
  // }, [phoneImagesArray])
  return (
    <div className="object-detection-images">
      {phoneImagesArray.map((image, index) => (
        <div key={index} className="image-container">
          <img
            src={image}
            alt="cell phone"
            style={{
              width: "300px",
              height: "300px",
              border: "1px solid black",
            }}
          />
        </div>
      ))}
    </div>
  );
}
