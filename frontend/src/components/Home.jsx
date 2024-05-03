import { useContext } from "react";
import { GameDataContext } from "../context/GameDataContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { setGameData } = useContext(GameDataContext);

  const url = "http://localhost:3000/start-game";
  const handleNewGame = async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Level ID currnetly hardcoded, to be changed later
      body: JSON.stringify({ levelId: "" }),
    });
    if (!response.ok) throw new Error(response.statusText);
    const resData = response.json();
    setGameData(resData);

    navigate("/play");
  };
  return (
    <>
      <h1 className="text-3xl font-bold my-6">
        Welcome to a photo tagging app!
      </h1>
      <button
        onClick={handleNewGame}
        className="px-5 py-2 text-[#102C57] border-solid rounded-md border-2 border-[#102C57] bg-[#EADBC8]"
      >
        New game
      </button>
    </>
  );
}
