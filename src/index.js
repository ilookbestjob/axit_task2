import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import "./index.css";
import "./PlayArea.scss";
import "./MenuPanel.scss";
import PlayArea from "./PlayArea";
import MenuPanel from "./MenuPanel";

const InitialState = {
  Score: 0,
  GameStatus: "Не начата",
  Dimensions: { width: 40, height: 20 },
  Snake: {
    positions: [
      { left: 3, top: 1 },
      { left: 3, top: 2 },
      { left: 3, top: 3 },
      { left: 3, top: 4 },
      { left: 3, top: 5 },
      { left: 3, top: 6 },
      { left: 3, top: 7 },
      { left: 3, top: 8 },
      { left: 3, top: 9 },
      { left: 3, top: 10  }
    ],
    TopDirection: 1,
    LeftDirection: 0
  },
  Dot: { position: { left: 6, top: 9 } }
};

const Reducer = (state = InitialState, action) => {
  let newState;
  let tempArray;
  switch (action.type) {
    case "START_GAME":
      newState = { ...state, GameStatus: "Начата" };
      return newState;
      return;
    case "RESET_GAME":
      newState = { ...state, GameStatus: "Начата" };
      return newState;
    case "STOP_GAME":
      newState = { ...state, GameStatus: "Завершена" };
      return newState;
    case "PAUSE_GAME":
      newState = { ...state, GameStatus: "Остановлена" };
      return newState;
      case "GAMOVER_GAME":
        newState = { ...state, GameStatus: "Проиграна" };
        return newState;
  

    case "INCREASE_SNAKE":
        tempArray = [...state.Snake.positions,{left:action.left,top:action.top}];
       
        newState = {
          ...state,
          Snake: {
            positions: tempArray,
            TopDirection: state.Snake.TopDirection,
            LeftDirection: state.Snake.LeftDirection
          }
        };
        return newState;
    case "SET_NEW_DOT":
        newState = {
          ...state,
          Dot: {
            position:{left:action.left,top:action.top}
           
          }
        };
        return newState;
      return;
    case "SET_SNAKE_STARTPOSITION":
      newState = {
        ...state,
        Snake: {
          positions: [
            { left: 3, top: 1 },
            { left: 3, top: 2 },
            { left: 3, top: 3 },
           
          ],
          TopDirection: 1,
          LeftDirection: 0
        }
      };
      return newState;

    case "SET_SNAKEPOSITION":
      tempArray = [...state.Snake.positions];
      tempArray.shift();
      tempArray = [
        ...tempArray,
        {
          left:
            tempArray[tempArray.length - 1].left + state.Snake.LeftDirection,
          top: tempArray[tempArray.length - 1].top + state.Snake.TopDirection
        }
      ];

      newState = {
        ...state,
        Snake: {
          positions: tempArray,
          TopDirection: state.Snake.TopDirection,
          LeftDirection: state.Snake.LeftDirection
        }
      };

      return newState;

    case "SET_SNAKEDIRECTION_LEFT":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 0,
          LeftDirection: -1
        }
      };
      return newState;
    case "SET_SNAKEDIRECTION_RIGHT":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 0,
          LeftDirection: 1
        }
      };
      return newState;

    case "SET_SNAKEDIRECTION_UP":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: -1,
          LeftDirection: 0
        }
      };
      return newState;
    case "SET_SNAKEDIRECTION_DOWN":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 1,
          LeftDirection: 0
        }
      };
      return newState;

    default:
      return state;
  }
};
const store = createStore(Reducer, InitialState);

ReactDOM.render(
  <Provider store={store}>
    <div className="GameLayout">
      <PlayArea />
      <MenuPanel />
    </div>
  </Provider>,
  document.getElementById("root")
);
