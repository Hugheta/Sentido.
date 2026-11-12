import { useEffect, useState } from "react";
import MenuScreen from "./components/MenuScreen";
import GameScreen from "./components/game/GameScreen";

type Screen = "menu" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [initialLevel, setInitialLevel] = useState(0);

  useEffect(() => {
    document.body.style.backgroundColor = screen === "game" ? "#000000" : "#f3eee2";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [screen]);

  const start = (levelIndex: number) => {
    setInitialLevel(levelIndex);
    setScreen("game");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const exit = () => {
    setScreen("menu");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (screen === "game") {
    return <GameScreen initialLevel={initialLevel} onExit={exit} />;
  }

  return <MenuScreen onStart={start} />;
}
