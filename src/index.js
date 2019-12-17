import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connectAdvanced } from "react-redux";
import "./index.scss";
import "./PlayArea.scss";
import "./MenuPanel.scss";
import PlayArea from "./PlayArea";
import MenuPanel from "./MenuPanel";

//Главный модуль.Здесь хранится состояние приложения,подключаются стили,проискодит отрисовка DOM

//Начальное состояние приложения
const InitialState = {
  //Счет Total-общий счет TypesCount-счет количества собранных элементов по типам
  Score: { Total: 0, TypesCount: [] },
  //Состояние игы "Начата" или "Не начата"
  GameStatus: "Не начата",
  //Задержка перед врезанием в стену
  //CrushDelay-максимальная задержка,
  //CurrentCrushDelay-текущая задержка у стены
  CrushDelay: 3,
  CurrentCrushDelay: 0,
  //Размер игровой точки
  DotWidth: 30,
  //Размер игрового поля
  Dimensions: { width: 20, height: 20 },
  //Состояние змейки
  //positions -положение елементов змейки
  // TopDirection-вертикальное напрвление
  // LeftDirection-горизонтальное направление
  Snake: {
    positions: [
      { left: 3, top: 1 },
      { left: 3, top: 2 },
      { left: 3, top: 3 }
    ],
    TopDirection: 1,
    LeftDirection: 0
  },
  //Напрвление реверса змейки
  ReverseDirection: "up",
  //Собранные картинки
  SnakePictures: ["Car.png", "Home.png", "Car.png"],
  //Текущая элемент для сбора
  Dot: { position: { left: 6, top: 9 }, DotType: 0 },
  //Типы элементов для сбора
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

//Редьюсер приложения
const Reducer = (state = InitialState, action) => {
  let newState;
  let tempArray;
  switch (action.type) {
    //Установка ширины игрового поля
    case "SET_WIDTH":
      newState = {
        ...state,
        Dimensions: { width: action.width, height: state.Dimensions.height }
      };
      return newState;
    //Установка высоты игрового поля
    case "SET_HEIGHT":
      newState = {
        ...state,
        Dimensions: { width: state.Dimensions.width, height: action.height }
      };
      return newState;
    //Начать игру, сброс предыдущего счета
    case "START_GAME":
      newState = {
        ...state,
        GameStatus: "Начата",
        Score: { Total: 0, TypesCount: [] },
        ReverseDirection: "up"
      };
      return newState;
    //Игра проиграна
    case "GAMOVER_GAME":
      newState = { ...state, GameStatus: "Проиграна" };
      return newState;
    //Сменить направление змейки, сортировка массивов Snake.positions и SnakePictures в обратном порядке
    case "REVERSE_SNAKE":
      tempArray = [...state.Snake.positions];
      const reversedPositions = tempArray.reverse();

      newState = {
        ...state,
        Snake: {
          positions: reversedPositions,
          TopDirection: action.TopDirection,
          LeftDirection: action.LeftDirection
        },
        SnakePictures: state.SnakePictures.reverse(),
        ReverseDirection: action.ReverseDirection
      };

      return newState;
    //Увеличение змейки при собраном элементе
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

      return newState;
    //Выставление нового элемента для сбора на игровое поле
    case "SET_NEW_DOT":
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
    //Сброс начального положения змейки
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
//Изменение текущего положения змейки в зависимости от напрвления
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
//Установка двежения змейки влево
    case "SET_SNAKEDIRECTION_LEFT":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 0,
          LeftDirection: -1
        },
        ReverseDirection: "right"
      };
      return newState;
      //Установка двежения змейки вправо
    case "SET_SNAKEDIRECTION_RIGHT":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 0,
          LeftDirection: 1
        },
        ReverseDirection: "left"
      };
      return newState;
//Установка двежения змейки вверх
    case "SET_SNAKEDIRECTION_UP":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: -1,
          LeftDirection: 0
        },
        ReverseDirection: "down"
      };
      return newState;
      //Установка двежения змейки вниз
    case "SET_SNAKEDIRECTION_DOWN":
      newState = {
        ...state,
        Snake: {
          positions: [...state.Snake.positions],
          TopDirection: 1,
          LeftDirection: 0
        },
        ReverseDirection: "up"
      };

      return newState;
// Увелечение счтечика задержки перед врезанием в стену
    case "INCREASE_CRUSH_DELAY":
      newState = {
        ...state,
        CurrentCrushDelay: state.CurrentCrushDelay + 1
      };

      return newState;
      // Сброс счтечика задержки перед врезанием в стену
    case "RESET_CRUSH_DELAY":
      newState = {
        ...state,
        CurrentCrushDelay: 0
      };

      return newState;

    default:
      return state;
  }
};
// Создание хранилища
const store = createStore(Reducer, InitialState);

//Отрисовка DOM
ReactDOM.render(
  <Provider store={store}>
    <div className="GameLayout">
      <PlayArea />
      <MenuPanel />
    </div>
  </Provider>,
  document.getElementById("root")
);
