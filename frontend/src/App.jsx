import { useState } from "react";
import { GameDataContext } from "./context/GameDataContext";
import Home from "./components/Home";
import Level from "./components/Level";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [gameData, setGameData] = useState();
  return (
    <>
      <GameDataContext.Provider value={{ gameData, setGameData }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/play" element={<Level />}></Route>
          </Routes>
        </BrowserRouter>
      </GameDataContext.Provider>
    </>
  );
}

export default App;
