import testImage from "./assets/sora-sagano-unsplash.jpg";

import { useRef } from "react";

function App() {
  const ref = useRef();

  const handleClick = (e) => {
    // apply styling to a circle
    ref.current.style.left = `${e.clientX}px`;
    ref.current.style.top = `${e.clientY}px`;
    ref.current.style.display = "block";

    // find relative position
    const rect = e.target.getBoundingClientRect();
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    const relativeX = e.clientX - rect.x;
    const relativeY = e.clientY - rect.y;
    const fractionX = relativeX / rectWidth;
    const fractionY = relativeY / rectHeight;
    console.log(`X fraction: ${fractionX}; Y fraction: ${fractionY}`);
  };

  return (
    <>
      <div
        className="hidden w-20 h-20 border-[#102C57]/[0.3] bg-[#102C57]/[0.2] border-solid border-2 rounded-full absolute pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
        ref={ref}
      ></div>
      <h1 className="text-3xl font-bold my-6">
        Welcome to a photo tagging app!
      </h1>

      <div className="max-w-7xl" onMouseDown={handleClick}>
        <img src={testImage} className="w-full" />
      </div>
      <p className="text-xl">
        Imgage credit:&#160;
        <a
          href="https://unsplash.com/photos/photo-of-two-black-white-and-orange-koi-fish-Dksk8szLRN0"
          className="text-[#1e52a3] underline underline-offset-2"
        >
          Sora Sagano Unsplash
        </a>
      </p>
    </>
  );
}

export default App;
