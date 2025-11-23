import { useState } from "react";
// import "./App.css";
import SudokuReceiver from "./SudokuReceiver";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <SudokuReceiver />
    </div>
  );
}

export default App;
