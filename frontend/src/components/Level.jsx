import { useEffect, useRef, useContext, useState } from "react";
import { GameDataContext } from "../context/GameDataContext";

export default function Level() {
  const { gameData, setGameData } = useContext(GameDataContext);
  const [items, setItems] = useState([]);
  const [normalizedCoordinates, setNormalizedCoordinates] = useState({});

  const url = "http://localhost:3000/validate";

  const ref = useRef();

  // TODO fetch game data from server
  useEffect(() => {
    const handleResize = () => {
      setNormalizedCoordinates({});
      ref.current.style.display = "none";
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setItems(gameData?.levelData?.items);
  }, [gameData]);

  const handleTest = (e) => {
    setGameData({
      levelData: {
        imageUrl:
          "https://images.unsplash.com/photo-1713458159923-e511573e905c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        items: [
          {
            name: "lamp",
            imageUrl: "https://m.media-amazon.com/images/I/61Ckk6bdzwL.jpg",
          },
          {
            name: "painting",
            imageUrl:
              "https://realismtoday.com/wp-content/uploads/2020/05/framing-art-Holton-Bill-Cone.jpg",
          },
        ],
      },
    });
  };

  const handleSelect = (e) => {
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
    setNormalizedCoordinates({ top: fractionY, left: fractionX });
  };

  const handleSubmit = async ({ itemName }) => {
    const { gameId } = gameData;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        itemName,
        normalizedCoordinates,
      }),
    });

    if (!response.ok) throw new Error(response.statusText);
    const { match, gameEnd, score } = await response.json();
    if (match) {
      setItems((items) => {
        items = items.filter((item) => item.name !== itemName);
        return items;
      });
    }
    if (gameEnd) {
      console.log("Score: ", score);
    }

    ref.current.style.display = "none";
  };

  return (
    <>
      <button onClick={handleTest}>Load test data</button>
      <div className="hidden fixed" ref={ref}>
        <div
          className=" w-20 h-20 border-[#102C57]/[0.3] bg-[#102C57]/[0.2] border-solid border-2 rounded-full absolute pointer-events-none left-0 inline-block"
          style={{ transform: "translate(-50%, -50%)" }}
        ></div>
        <div className="border-[#DAC0A3] border-solid border absolute bg-[#EADBC8] left-10 -top-10 min-w-24 w-max">
          {items?.length
            ? items.map((option) => (
                <button
                  onClick={() => {
                    handleSubmit({ itemName: option.name });
                  }}
                  key={option.name}
                  className="border-[#DAC0A3] border-solid border w-full text-left flex"
                >
                  <img
                    src={option.imageUrl}
                    alt={option.name}
                    className="w-6 h-6 inline-block"
                  />
                  <p className="inline mx-2">{option.name}</p>
                </button>
              ))
            : "No data"}
        </div>
      </div>

      <div className="max-w-7xl" onMouseDown={handleSelect}>
        <img src={gameData?.levelData?.imageUrl} className="w-full" />
      </div>
    </>
  );
}
