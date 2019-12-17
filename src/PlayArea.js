import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

//Основной компонент игры-Игровое поле.Здесь большая часть логики
class PlayArea extends React.Component {
  constructor(props) {
    super(props);
    //переменная ссулка на таймер
    this.TimerPointer = null;
    //функция начала игры,диспатч сотояния игры - "Начата"
    this.menuActions = () => {
      this.setDot();
      this.props.resetSnake();
      this.props.startGame();
      this.TimerPointer = setInterval(this.SnakeActions, 400);
    };
    //функция завершения игры,диспатч сотояния игры - "Завершена"
    this.menuActions2 = () => {
      this.props.stopGame();
      clearInterval(this.TimerPointer);
    };
    //функция установки точки,диспатч полождения нового элемента для сбора
    this.setDot = () => {
      const LEFT =
        Math.floor(Math.random() * this.props.Data.Dimensions.width) + 1;
      const TOP =
        Math.floor(Math.random() * this.props.Data.Dimensions.height) + 1;

      const DOTTYPE = Math.floor(
        Math.random() * this.props.Data.DotTypes.length
      );

      this.props.setDot(LEFT, TOP, DOTTYPE);
    };
    //алгоритм игры
    this.SnakeActions = () => {
      let tempArray = [...this.props.Data.Snake.positions];
      let SnakeHead = tempArray[tempArray.length - 1];
      //если следующий шаг змейки будет за пределами игрового поля,
      //то запустить счетчик задержки врезания в стену
      if (
        tempArray[tempArray.length - 1].left +
          this.props.Data.Snake.LeftDirection <
          1 ||
        tempArray[tempArray.length - 1].left +
          this.props.Data.Snake.LeftDirection >
          this.props.Data.Dimensions.width ||
        tempArray[tempArray.length - 1].top +
          this.props.Data.Snake.TopDirection <
          1 ||
        tempArray[tempArray.length - 1].top +
          this.props.Data.Snake.TopDirection >
          this.props.Data.Dimensions.height
      ) {
        //если счетчик задержки врезания в стену прывысил пороговое значение,
        //закончить игру, обнулить счетчик
        if (this.props.Data.CrushDelay === this.props.Data.CurrentCrushDelay) {
          this.props.gamoverGame();
          clearInterval(this.TimerPointer);
          this.props.resetCrushDelay();
        } else this.props.increaseCrushDelay();
      }
      //Проверка врезания змейки в себя: если в теле змейки есть
      //еще элемнет с такими же координатами,что и голова,закончить игру
      else {
        if (
          tempArray.findIndex((item, index) => {
            if (
              index !== tempArray.length - 1 &&
              item.top === SnakeHead.top &&
              item.left === SnakeHead.left
            ) {
            }
            return (
              index !== tempArray.length - 1 &&
              item.top === SnakeHead.top &&
              item.left === SnakeHead.left
            );
          }) !== -1
        ) {
          this.props.gamoverGame();
          clearInterval(this.TimerPointer);
        }
        //Сбор элемента,увеличение длины змейки:если координаты элемента для сбора
        //совпадают с координатами головы змейки,длинить змейку,
        //выставить новый элемент для сбора
        else {
          if (
            SnakeHead.left + this.props.Data.Snake.LeftDirection ==
              this.props.Data.Dot.position.left &&
            SnakeHead.top + this.props.Data.Snake.TopDirection ==
              this.props.Data.Dot.position.top
          ) {
            this.props.increaseSnake(
              this.props.Data.Dot.position.left,
              this.props.Data.Dot.position.top,
              this.props.Data.DotTypes[this.props.Data.Dot.DotType].score,
              this.props.Data.Dot.DotType,
              this.props.Data.DotTypes[this.props.Data.Dot.DotType].picture
            );
            this.setDot();
          } else {
            this.props.resetCrushDelay();
            this.props.setSnakePosition();
          }
        }
      }
    };
    //ссылка на DOM элемент игрового поля
    this.PlayAreaDiv = React.createRef();

    //Вспомогательная функция для подготовки к отрисовке игрового поля.
    //Определяет принадлежить ли текущая точка игрового поля змейке
    this.SnakeItemIndex = (PlayAreaCol, PlayAreaRow) =>
      this.props.Data.Snake.positions.findIndex(
        SnakePosition =>
          SnakePosition.left === PlayAreaCol &&
          SnakePosition.top === PlayAreaRow
      );
    //Вспомогательная функция отрисовки игорвого поля
    this.GET_AREA = () => {
      let PlayAreaField = "";
      //Цикл пербор точек игрового поля по горизонтали
      for (
        let PlayAreaRow = 1;
        PlayAreaRow <= this.props.Data.Dimensions.height;
        PlayAreaRow++
      ) {
        //Цикл пербор точек игрового поля по вертикали
        for (
          let PlayAreaCol = 1;
          PlayAreaCol <= this.props.Data.Dimensions.width;
          PlayAreaCol++
        ) {
          const SNAKEITEMINDEX = this.SnakeItemIndex(PlayAreaCol, PlayAreaRow);
          //проверяем принадлежить ли текущая точка игрового поля змейке.Если да то,
          // отрисовываем элемент змейки в этой точке

          if (
            SNAKEITEMINDEX !== -1 &&
            this.props.Data.GameStatus !== "Не начата"
          ) {
            PlayAreaField =
              PlayAreaField +
              '<div class="PlayAreaSnakeDot" ><img class="PlayAreaDotPicture" src="img/' +
              this.props.Data.SnakePictures[SNAKEITEMINDEX] +
              '"/></div>';
          }
          //Иначе проверяем принадлежить ли текущая точка игрового поля элементу для сбора.Если да то,
          // отрисовываем элемент сбора в этой точке
          else {
            if (
              this.props.Data.Dot.position.left === PlayAreaCol &&
              this.props.Data.Dot.position.top === PlayAreaRow
            ) {
              PlayAreaField =
                PlayAreaField +
                '<div class="PlayAreaDot"><img class="PlayAreaDotPicture" src="img/' +
                this.props.Data.DotTypes[this.props.Data.Dot.DotType * 1]
                  .picture +
                '"></div>';
            } //Иначе отрисовываем пустой элемент игрового поля
            else {
              PlayAreaField =
                PlayAreaField + '<div class="PlayAreaEmptyDot"></div>';
            }
          }
        }
      }
      //Возвращаем строку с эелемнетами игрового поля
      return PlayAreaField;
    };

    //Проверка нажатий клавиш на клавиатуре
    this.KeydownEventHandler = event => {
      switch (event.code) {
        //Клавиша вверх
        case "ArrowUp":
          //Если клавиша для реверса змейки не совпадает с клавишей вверх, то
          //изменяем напрвление змейки вверх, иначе делаем реверс змейки
          if (this.props.Data.ReverseDirection !== "up") {
            this.props.setSnakeDirectionUp();
          } else this.props.reverseSnake(0, -1, "down");
          break;
        //Клавиша вниз
        case "ArrowDown":
          //Если клавиша для реверса змейки не совпадает с клавишей вниз, то
          //изменяем напрвление змейки вниз, иначе делаем реверс змейки
          if (this.props.Data.ReverseDirection !== "down") {
            this.props.setSnakeDirectionDown();
          } else this.props.reverseSnake(0, 1, "up");
          break;
        //Клавиша влево
        case "ArrowLeft":
          //Если клавиша для реверса змейки не совпадает с клавишей влево, то
          //изменяем напрвление змейки влево, иначе делаем реверс змейки
          if (this.props.Data.ReverseDirection !== "left") {
            this.props.setSnakeDirectionLeft();
          } else this.props.reverseSnake(-1, 0, "right");
          break;
        //Клавиша вправо
        case "ArrowRight":
          //Если клавиша для реверса змейки не совпадает с клавишей вправо, то
          //изменяем напрвление змейки вправо, иначе делаем реверс змейки
          if (this.props.Data.ReverseDirection !== "right") {
            this.props.setSnakeDirectionRight();
          } else this.props.reverseSnake(1, 0, "left");
          break;
      }
    };
  }
//При монтировании компонента установка  EventListener для клавиатуры,
//определение размерности игровго поля
  componentDidMount() {
    window.addEventListener("keydown", this.KeydownEventHandler);
    const PLAYAREA_WIDTH = Math.trunc(
      this.PlayAreaDiv.current.clientWidth / this.props.Data.DotWidth
    );
    const PLAYAREA_HEIGHT = Math.trunc(
      this.PlayAreaDiv.current.clientHeight / this.props.Data.DotWidth
    )-2;
    this.props.setWidth(PLAYAREA_WIDTH);
    this.props.setHeight(PLAYAREA_HEIGHT);
  }
  //Отрисовка компонента
  render() {
    //Если игра начата, то отрисовать игровое поле
    if (this.props.Data.GameStatus === "Начата") {
      return (
        <div className="PlayAreaWrapper" ref={this.PlayAreaDiv}>
          <div
            className="PlayArea"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(" + this.props.Data.Dimensions.width + ", 1fr)"
            }}
          >
            {ReactHtmlParser(this.GET_AREA())}
          </div>
        </div>
      );
    } 
    //Иначе отрисовать диалог
    else {
      return (
        <div className="InfoAreaWrapper" ref={this.PlayAreaDiv}>
          <div className="InfoArea">
            <div className="PlayAreaInfo">
              На десктопах и ноутбуках управление совершается стрелками
              клавиатуры. На мобильных устройствах с помощью графического
              интерфейса.
            </div>
            <div className="PlayAreaStart" onClick={this.menuActions}>
              Старт
            </div>
          </div>
        </div>
      );
    }
  }
}
//Подключение к store
export default connect(
  store => ({
    Data: store
  }),
  dispatch => ({
    setWidth: Areawidth => {
      dispatch({ type: "SET_WIDTH", width: Areawidth });
    },
    setHeight: Areaheight => {
      dispatch({ type: "SET_HEIGHT", height: Areaheight });
    },
    setSnakePosition: () => {
      dispatch({ type: "SET_SNAKEPOSITION" });
    },
    setSnakeDirectionDown: () => {
      dispatch({ type: "SET_SNAKEDIRECTION_DOWN" });
    },
    setSnakeDirectionUp: () => {
      dispatch({ type: "SET_SNAKEDIRECTION_UP" });
    },
    setSnakeDirectionLeft: () => {
      dispatch({ type: "SET_SNAKEDIRECTION_LEFT" });
    },
    setSnakeDirectionRight: () => {
      dispatch({ type: "SET_SNAKEDIRECTION_RIGHT" });
    },

    startGame: () => {
      dispatch({ type: "START_GAME" });
    },
    stopGame: () => {
      dispatch({ type: "STOP_GAME" });
    },
    resetSnake: () => {
      dispatch({ type: "SET_SNAKE_STARTPOSITION" });
    },
    setGame: () => {
      dispatch({ type: "RESET_GAME" });
    },
    pauseGame: () => {
      dispatch({ type: "PAUSE_GAME" });
    },

    gamoverGame: () => {
      dispatch({ type: "GAMOVER_GAME" });
    },
    increaseSnake: (left, top, increasement, DotType, picture) => {
      dispatch({
        type: "INCREASE_SNAKE",
        left: left,
        top: top,
        increasement: increasement,
        DotType: DotType,
        picture: picture
      });
    },
    setDot: (left, top, DotType) => {
      dispatch({ type: "SET_NEW_DOT", left: left, top: top, DotType: DotType });
    },
    resetSnake: () => {
      dispatch({ type: "SET_SNAKE_STARTPOSITION" });
    },
    increaseCrushDelay: () => {
      dispatch({ type: "INCREASE_CRUSH_DELAY" });
    },
    resetCrushDelay: () => {
      dispatch({ type: "RESET_CRUSH_DELAY" });
    },

    reverseSnake: (left, top, reverse) => {
      dispatch({
        type: "REVERSE_SNAKE",
        LeftDirection: left,
        TopDirection: top,
        ReverseDirection: reverse
      });
    }
  })
)(PlayArea);
