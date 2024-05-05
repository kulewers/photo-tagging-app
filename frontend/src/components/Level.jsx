import { useEffect, useRef, useContext, useState } from "react";
import { GameDataContext } from "../context/GameDataContext";
import { useForm } from "react-hook-form";

export default function Level() {
  const { gameData, setGameData } = useContext(GameDataContext);
  const [items, setItems] = useState([]);
  const [normalizedCoordinates, setNormalizedCoordinates] = useState({});
  const [score, setScore] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);

  const url = "http://localhost:3000/validate";

  const targetCircle = useRef();

  // TODO fetch game data from server
  useEffect(() => {
    const handleRemove = () => {
      setNormalizedCoordinates({});
      targetCircle.current.style.display = "none";
    };
    window.addEventListener("resize", handleRemove);
    window.addEventListener("scroll", handleRemove);
    return () => {
      window.removeEventListener("resize", handleRemove);
      window.removeEventListener("scroll", handleRemove);
    };
  }, []);

  useEffect(() => {
    setItems(gameData?.levelData?.items);
  }, [gameData]);

  // const handleTest = (e) => {
  //   setGameData({
  //     levelData: {
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1713458159923-e511573e905c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //       items: [
  //         {
  //           name: "lamp",
  //           imageUrl: "https://m.media-amazon.com/images/I/61Ckk6bdzwL.jpg",
  //         },
  //         {
  //           name: "painting",
  //           imageUrl:
  //             "https://realismtoday.com/wp-content/uploads/2020/05/framing-art-Holton-Bill-Cone.jpg",
  //         },
  //       ],
  //     },
  //   });
  // };

  const handleSelect = (e) => {
    // apply styling to a circle
    targetCircle.current.style.left = `${e.clientX}px`;
    targetCircle.current.style.top = `${e.clientY}px`;
    targetCircle.current.style.display = "block";

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

  const handleValidateSubmit = async ({ itemName }) => {
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
      setShowModal(true);
      setCurrentModal("scoreSubmit");
    }

    if (score) {
      setScore(score);
    }

    targetCircle.current.style.display = "none";
  };

  return (
    <>
      {/* <button onClick={handleTest}>Load test data</button> */}
      <div className="hidden fixed" ref={targetCircle}>
        <div
          className=" w-20 h-20 border-[#102C57]/[0.3] bg-[#102C57]/[0.2] border-solid border-2 rounded-full absolute pointer-events-none left-0 inline-block"
          style={{ transform: "translate(-50%, -50%)" }}
        ></div>
        <div className="border-[#DAC0A3] border-solid border absolute bg-[#EADBC8] left-10 -top-10 min-w-24 w-max">
          {items?.length
            ? items.map((option) => (
                <button
                  onClick={() => {
                    handleValidateSubmit({ itemName: option.name });
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

      <Modal show={showModal}>
        {currentModal === "scoreSubmit" ? (
          <NameSubmitModal
            show={currentModal === "scoreSubmit"}
            score={score}
            afterSubmit={() => setCurrentModal("scoreboard")}
          />
        ) : //  currentModal === "scoreboard" ?
        //  (<ScoreboardModal show={currentModal === "scoreboard"} />):
        null}
      </Modal>
    </>
  );
}

function Modal({ show, children }) {
  return (
    <div
      className={`w-full h-full z-10 bg-black/[0.4] left-0 top-0 fixed ${
        show ? "block" : "hidden"
      }`}
    >
      {children}
    </div>
  );
}

function NameSubmitModal({ show, score, afterSubmit }) {
  const { gameData } = useContext(GameDataContext);
  const [errorMessages, setErrorMessages] = useState([]);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:3000/submit-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const res = await response.json();

      const errors = res.errors.map((obj) => obj.msg);

      setErrorMessages(errors);

      throw new Error("Name submit failed");
    }

    afterSubmit();
  };

  return (
    <div
      className={`bg-[#EADBC8] border-solid border-2 border-[#102C57] px-5 py-2 rounded-md absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ${
        show ? "block" : "hidden"
      }`}
    >
      <p>You won in {score / 1000} seconds.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="playerName">Submit your name for the scoreboard:</label>
        <br />
        <input
          type="text"
          id="playerName"
          {...register("playerName", { required: true })}
        />
        <input type="hidden" value={gameData?.gameId} {...register("gameId")} />
        <br />
        {!!errorMessages.length && (
          <>
            <ul>
              {errorMessages.map((error) => (
                <li className="text-red-700">{error}</li>
              ))}
            </ul>
            <br />
          </>
        )}

        <button
          type="submit"
          className="mt-3 px-1 py-[0.125rem] text-[#102C57] border-solid rounded-md border-2 border-[#102C57] bg-[#EADBC8]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function ScoreboardModal({ show }) {
  const { gameData } = useContext(GameDataContext);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (gameData?.levelId) {
        const response = await fetch(
          `http://localhost:3000/scores/${gameData?.levelId}`
        );
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch scores");
        const resData = response.json();
        return resData;
      }
    };
    fetchData().then((data) => setScores(data));
  }, []);

  return (
    <div
      className={`bg-[#EADBC8] border-solid border-2 border-[#102C57] px-5 py-2 rounded-md absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ${
        show ? "block" : "hidden"
      }`}
    >
      <ol>
        {scores?.length &&
          scores.map((score) => (
            <li>{score.playerName + " - " + score.scoreMilliseconds / 1000}</li>
          ))}
      </ol>
    </div>
  );
}
