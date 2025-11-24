import axios from "axios";
import { useState } from "react";
import "./SudokuReciever.css";

export default function SudokuReceiver() {
  const [activeCell, setActiveCell] = useState({ rowIndex: -1, cellIndex: -1 });
  const [moreLessMode, setMoreLessMode] = useState(false);
  const [secondClick, setSecondClick] = useState(false);
  const [moreMode, setMoreMode] = useState(true);
  const [lessMode, setLessMode] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [rules, setRules] = useState([]);
  const [oldSudoku, setOldSudoku] = useState(
    Array(6)
      .fill(0)
      .map(() => Array(6).fill(0))
  );
  const [requestSudoku, setRequestSudoku] = useState(
    Array(6)
      .fill(0)
      .map(() => Array(6).fill(0))
  );
  const [response, setResponse] = useState(
    Array(6)
      .fill(0)
      .map(() => Array(6).fill(0))
  );

  const sendRequest = async () => {
    try {
      const res = await axios.post("https://api.pingvinchyk.com/sudokuPlus", {
        rules: rules,
      });

      setOldSudoku(requestSudoku);
      res.data !== null
        ? (setResponse(res.data), setErrorText(""))
        : setErrorText("There is no solutions");
    } catch (error) {
      console.log(error);
      setErrorText("Network error: couldn't reach solver");
    }
  };

  const setNewNumber = (newNumber) => {
    if (activeCell.rowIndex === -1 || activeCell.cellIndex === -1) return;
    const value = newNumber + 1;
    setRequestSudoku((prev) => {
      const updated = prev.map((row) => [...row]);
      const currentValue = updated[activeCell.rowIndex][activeCell.cellIndex];
      if (currentValue === value) {
        updated[activeCell.rowIndex][activeCell.cellIndex] = 0;
        setRules((prev) =>
          prev.filter(
            ([r1, c1, op]) =>
              !(
                r1 === activeCell.rowIndex &&
                c1 === activeCell.cellIndex &&
                op === "="
              )
          )
        );

        return updated;
      }
      updated[activeCell.rowIndex][activeCell.cellIndex] = value;
      setRules((prev) => {
        const filtered = prev.filter(
          ([r1, c1, op]) =>
            !(
              r1 === activeCell.rowIndex &&
              c1 === activeCell.cellIndex &&
              op === "="
            )
        );

        return [
          ...filtered,
          [activeCell.rowIndex, activeCell.cellIndex, "=", value, 0],
        ];
      });

      return updated;
    });
  };

  const clearAll = () => {
    setActiveCell({ rowIndex: -1, cellIndex: -1 });
    setRules([]);
    setRequestSudoku(
      Array(6)
        .fill(0)
        .map(() => Array(6).fill(0))
    );
    setResponse(
      Array(6)
        .fill(0)
        .map(() => Array(6).fill(0))
    );
    setOldSudoku(
      Array(6)
        .fill(0)
        .map(() => Array(6).fill(0))
    );
    setErrorText("");
    setMoreLessMode(false);
    setSecondClick(false);
    setMoreMode(true);
    setLessMode(false);
  };

  const bg = "linear-gradient(135deg, #05010f, #0c0020, #150030)";
  const glass = "rgba(255,255,255,0.05)";
  const accent = "#6a00ff";
  const neon = "#00ffb3";

  return (
    <div
      className="sudoku-wrapper"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "1100px",
          maxWidth: "95%",
          display: "flex",
          flexDirection: "column",
          gap: 25,
          alignItems: "center",
        }}
      >
        <h1
          className="sudoku-title"
          style={{
            fontSize: 36,
            letterSpacing: 1,
            fontWeight: 700,
            textShadow: `0 0 30px ${accent}`,
            marginBottom: 10,
          }}
        >
          Futuristic Sudoku+ Solver
        </h1>

        <div className="sudoku-main" style={{ display: "flex", gap: 25 }}>
          {/* LEFT SIDE */}
          <div className="sudoku-left" style={{ flex: 1 }}>
            <div
              className="sudoku-grid"
              style={{
                padding: 18,
                borderRadius: 18,
                background: glass,
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              {requestSudoku.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                  {row.map((cell, cellIndex) => {
                    const isActive =
                      activeCell.rowIndex === rowIndex &&
                      activeCell.cellIndex === cellIndex;

                    const isNearActive =
                      (rowIndex === activeCell.rowIndex - 1 &&
                        cellIndex === activeCell.cellIndex) ||
                      (rowIndex === activeCell.rowIndex + 1 &&
                        cellIndex === activeCell.cellIndex) ||
                      (rowIndex === activeCell.rowIndex &&
                        (cellIndex === activeCell.cellIndex - 1 ||
                          cellIndex === activeCell.cellIndex + 1));

                    const rulesForCell = rules.filter(
                      ([r1, c1, op, r2, c2]) =>
                        r1 === rowIndex && c1 === cellIndex
                    );

                    return (
                      <div
                        key={cellIndex}
                        onClick={() => {
                          moreLessMode && secondClick && isNearActive
                            ? (setRules((prev) => [
                                ...prev,
                                [
                                  activeCell.rowIndex,
                                  activeCell.cellIndex,
                                  moreMode ? ">" : "<",
                                  rowIndex,
                                  cellIndex,
                                ],
                              ]),
                              setSecondClick(false))
                            : rowIndex !== activeCell.rowIndex ||
                              cellIndex !== activeCell.cellIndex
                            ? (setActiveCell({ rowIndex, cellIndex }),
                              setSecondClick(true))
                            : setActiveCell({ rowIndex: -1, cellIndex: -1 });
                        }}
                        style={{
                          width: 62,
                          height: 62,
                          margin: 5,
                          borderRadius: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "0.25s ease",

                          background: isActive
                            ? `radial-gradient(circle, ${accent}, transparent)`
                            : isNearActive && moreLessMode && secondClick
                            ? `linear-gradient(135deg, ${neon}33, ${accent}33)`
                            : glass,

                          boxShadow: isActive
                            ? `0 0 25px ${accent}`
                            : "0 0 12px rgba(0,0,0,0.6)",

                          border: isActive
                            ? `2px solid ${neon}`
                            : "1px solid rgba(255,255,255,0.15)",
                          transform: isActive ? "scale(1.08)" : "scale(1)",
                          position: "relative",
                        }}
                      >
                        {cell !== 0 ? cell : ""}

                        {rulesForCell.map(([r1, c1, op, r2, c2], i) => {
                          let symbol = "";
                          if (op === "=") {
                            symbol = "";
                          } else if (r1 === rowIndex && c1 === cellIndex) {
                            if (r2 === rowIndex + 1 && c2 === cellIndex)
                              symbol = "v";
                            else if (r2 === rowIndex - 1 && c2 === cellIndex)
                              symbol = "^";
                            else if (r2 === rowIndex && c2 === cellIndex + 1)
                              symbol = ">";
                            else if (r2 === rowIndex && c2 === cellIndex - 1)
                              symbol = "<";
                          } else if (r2 === rowIndex && c2 === cellIndex) {
                            // reverse for target square
                            if (r1 === rowIndex + 1 && c1 === cellIndex)
                              symbol = "^";
                            else if (r1 === rowIndex - 1 && c1 === cellIndex)
                              symbol = "v";
                            else if (r1 === rowIndex && c1 === cellIndex + 1)
                              symbol = "<";
                            else if (r1 === rowIndex && c1 === cellIndex - 1)
                              symbol = ">";
                          }

                          const posStyle = {
                            position: "absolute",
                            fontSize: "1rem", // relative, will scale better
                            color: "#ffd24d",
                            textShadow: `0 0 8px ${neon}`,
                            top:
                              symbol === "v"
                                ? "110%" // bottom of cell
                                : symbol === "^"
                                ? "-5%" // top of cell
                                : "50%", // center
                            left:
                              symbol === ">"
                                ? "110%" // right
                                : symbol === "<"
                                ? "-10%" // left
                                : "50%", // center
                            transform: "translate(-50%, -50%)",
                          };

                          return (
                            <div key={i} style={posStyle}>
                              {symbol}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* NUMBER PICKER */}
            <div
              className="number-picker"
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {requestSudoku[0].map((_, i) => (
                <div
                  key={i}
                  onClick={() => setNewNumber(i)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: glass,
                    border: `1px solid ${accent}`,
                    fontWeight: 700,
                    fontSize: 20,
                    cursor: "pointer",
                    transition: "0.25s",
                    boxShadow: `0 0 10px ${accent}88`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* MODE BUTTONS */}
            <div
              className="mode-buttons"
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                gap: 15,
              }}
            >
              {["> <", "<", ">"].map((op, i) => (
                <div
                  key={i}
                  onClick={() =>
                    op === "> <"
                      ? setMoreLessMode((p) => !p)
                      : op === "<"
                      ? (setLessMode(true), setMoreMode(false))
                      : (setMoreMode(true), setLessMode(false))
                  }
                  style={{
                    padding: "14px 20px",
                    borderRadius: 16,
                    background:
                      (op === "> <" && moreLessMode) ||
                      (op === "<" && lessMode) ||
                      (op === ">" && moreMode)
                        ? `linear-gradient(135deg, ${accent}, ${neon})`
                        : glass,
                    boxShadow:
                      (op === "> <" && moreLessMode) ||
                      (op === "<" && lessMode) ||
                      (op === ">" && moreMode)
                        ? `0 0 20px ${accent}`
                        : "0 0 10px rgba(0,0,0,0.6)",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {op} Mode
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="sudoku-right"
            style={{
              width: 340,
              padding: 18,
              borderRadius: 18,
              background: glass,
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="result-grid">
              {response.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                  {row.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      style={{
                        width: 50,
                        height: 50,
                        margin: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        fontSize: 18,
                        fontWeight: 600,
                        color:
                          oldSudoku[rowIndex][cellIndex] !== 0 ? neon : "white",
                      }}
                    >
                      {cell !== 0 ? cell : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="action-btn"
              onClick={sendRequest}
              style={{
                marginTop: 20,
                padding: "18px 10px",
                borderRadius: 18,
                background: `linear-gradient(135deg, ${accent}, ${neon})`,
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 20,
                boxShadow: `0 0 25px ${accent}`,
              }}
            >
              Find Solution
            </div>
            <div
              className="action-btn"
              onClick={clearAll}
              style={{
                marginTop: 15,
                padding: "14px 10px",
                borderRadius: 18,
                background: "rgba(255,80,80,0.15)",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 18,
                border: "1px solid rgba(255,80,80,0.6)",
                boxShadow: "0 0 18px rgba(255,80,80,0.5)",
                color: "#ff8080",
              }}
            >
              Clear Board
            </div>

            {errorText && (
              <div
                style={{
                  marginTop: 12,
                  color: "#ff8787",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {errorText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
