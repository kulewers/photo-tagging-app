import testImage from "./assets/sora-sagano-unsplash.jpg";

import { useRef, useEffect } from "react";

function App() {
  const ref = useRef();

  // TODO fetch game data from server
  let gameData;

  useEffect(() => {
    const handleResize = () => {
      ref.current.style.display = "none";
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    // TODO send data to server
  };

  return (
    <>
      <div className="hidden fixed" ref={ref}>
        <div
          className=" w-20 h-20 border-[#102C57]/[0.3] bg-[#102C57]/[0.2] border-solid border-2 rounded-full absolute pointer-events-none left-0 inline-block"
          style={{ transform: "translate(-50%, -50%)" }}
        ></div>
        <div className="border-[#DAC0A3] border-solid border-2 absolute bg-[#EADBC8] inline-block left-10 -top-10 p-1 min-w-24">
          {gameData?.options
            ? gameData.options.map((option) => <button>{option}</button>)
            : "No data loaded"}
        </div>
      </div>

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
