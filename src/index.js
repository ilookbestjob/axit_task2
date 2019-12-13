import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connectAdvanced } from "react-redux";
import "./index.css";
import "./PlayArea.scss";
import "./MenuPanel.scss";
import PlayArea from "./PlayArea";
import MenuPanel from "./MenuPanel";

const InitialState = {
  Score: { Total: 0, TypesCount: [] },
  GameStatus: "Не начата",
  Dimensions: { width: 30, height: 20 },
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
      { left: 3, top: 10 }
    ],
    TopDirection: 1,
    LeftDirection: 0
  },
  ReverseDirection:'up',
  SnakePictures: ["Car.png", "Home.png", "Car.png"],
  Dot: { position: { left: 6, top: 9 }, DotType: 0 },
  DotTypes: [
    {
      name: "Машина",
      score: 500,
      color: "#ССС",
      picture: "Car.png",
      sound: ""
    },
    { name: "Дом", score: 2000, color: "#ССС", picture: "Home.png", sound: "" },
    {
      name: "Сюрприз",
      score: 300,
      color: "#ССС",
      picture: "Present.png",
      sound: ""
    },
    {
      name: "Сюрприз",
      score: 100,
      color: "#ССС",
      picture: "Perfume.png",
      sound: ""
    },
    {
      name: "Компьютер",
      score: 100,
      color: "#ССС",
      picture: "Computer.png",
      sound: ""
    }
  ]
};

const Reducer = (state = InitialState, action) => {
  let newState;
  let tempArray;
  switch (action.type) {
    case "START_GAME":
      newState = {
        ...state,
        GameStatus: "Начата",
        Score: { Total: 0, TypesCount: [] }
      };
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
      tempArray = [
        ...state.Snake.positions,
        { left: action.left, top: action.top }
      ];
      let tempTypesCount = [...state.Score.TypesCount];
      let TypesCountIndex = tempTypesCount.findIndex(
        Item => Item.CountType === action.DotType
      );
      if (TypesCountIndex === -1) {
        tempTypesCount.push({ CountType: action.DotType, Score: 1 });
      } else {
        tempTypesCount[TypesCountIndex].Score =
          tempTypesCount[TypesCountIndex].Score + 1;
      }
      newState = {
        ...state,
        Score: {
          Total: state.Score.Total + action.increasement,
          TypesCount: tempTypesCount
        },
        Snake: {
          positions: tempArray,
          TopDirection: state.Snake.TopDirection,
          LeftDirection: state.Snake.LeftDirection
        },
        SnakePictures: [...state.SnakePictures, action.picture]
      };
      console.log(newState);

      return newState;
    case "SET_NEW_DOT":
      console.log(action.DotType, action.left, action.top);
      newState = {
        ...state,
        Dot: {
          position: {
            left: action.left,
            top: action.top
          },
          DotType: action.DotType
        }
      };
      return newState;
      return;
    case "SET_SNAKE_STARTPOSITION":
      newState = {
        ...state,
        Snake: {
          positions: [
            { left: 3, top: 1, color: "#ccc", picture: "" },
            { left: 3, top: 2, color: "#ccc", picture: "" },
            { left: 3, top: 3, color: "#ccc", picture: "" }
          ],
          TopDirection: 1,
          LeftDirection: 0
        },
        SnakePictures: ["Car.png", "Home.png", "Car.png"]
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
        },ReverseDirection:'right'
      };
      return newState;
    case "SET_SNAKEDIRECTION_RIGHT":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 0,
          LeftDirection: 1
        },ReverseDirection:'left'
      };
      return newState;

    case "SET_SNAKEDIRECTION_UP":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: -1,
          LeftDirection: 0
        },ReverseDirection:'down'
      };
      return newState;
    case "SET_SNAKEDIRECTION_DOWN":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 1,
          LeftDirection: 0
        },ReverseDirection:'up'
      };

      return newState;

    default:
      return state;
  }
};
const store = createStore(Reducer, InitialState);
store.subscribe(() => {
  //console.log(store.getState());
});
ReactDOM.render(
  <Provider store={store}>
    <div className="GameLayout">
      <PlayArea />
      <MenuPanel />
    </div>
  </Provider>,
  document.getElementById("root")
);
