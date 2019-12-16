import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

class PlayArea extends React.Component {
  constructor(props) {
    super(props);
    ///////
    this.TimerPointer = null;
    this.menuActions = () => {
      this.setDot();
      this.props.resetSnake();
      this.props.startGame();
      this.TimerPointer = setInterval(this.SnakeActions, 200);
    };
    this.menuActions2 = () => {
      this.props.stopGame();
      clearInterval(this.TimerPointer);
    };
    this.setDot = () => {
      const LEFT =
        Math.floor(Math.random() * this.props.Data.Dimensions.width) + 1;
      const TOP =
        Math.floor(Math.random() * this.props.Data.Dimensions.height) + 1;

      const DOTTYPE = Math.floor(
        Math.random() * this.props.Data.DotTypes.length
      );

      console.log(DOTTYPE);

      this.props.setDot(LEFT, TOP, DOTTYPE);
    };

    this.SnakeActions = () => {
      let tempArray = [...this.props.Data.Snake.positions];
      let SnakeHead = tempArray[tempArray.length - 1];
      if (
        tempArray[tempArray.length - 1].left < 1 ||
        tempArray[tempArray.length - 1].left >
          this.props.Data.Dimensions.width ||
        tempArray[tempArray.length - 1].top < 1 ||
        tempArray[tempArray.length - 1].top > this.props.Data.Dimensions.height
      ) {
        this.props.gamoverGame();
        clearInterval(this.TimerPointer);
      } else {
        if (
          tempArray.findIndex((item, index) => {
            if (
              index !== tempArray.length - 1 &&
              item.top === SnakeHead.top &&
              item.left === SnakeHead.left
            ) {
              console.log("index", index);
              console.log("top", item.top === SnakeHead.top);
              console.log("left", item.left === SnakeHead.left);
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
        } else {
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
            this.props.setSnakePosition();
          }
        }
      }
    };
    //////
    this.PlayAreaDiv = React.createRef();
    this.SnakeItemIndex = (PlayAreaCol, PlayAreaRow) =>
      this.props.Data.Snake.positions.findIndex(
        SnakePosition =>
          SnakePosition.left === PlayAreaCol &&
          SnakePosition.top === PlayAreaRow
      );

    this.GET_AREA = () => {
      let PlayAreaField = "";

      for (
        let PlayAreaRow = 1;
        PlayAreaRow <= this.props.Data.Dimensions.height;
        PlayAreaRow++
      ) {
        for (
          let PlayAreaCol = 1;
          PlayAreaCol <= this.props.Data.Dimensions.width;
          PlayAreaCol++
        ) {
          const SNAKEITEMINDEX = this.SnakeItemIndex(PlayAreaCol, PlayAreaRow);
          if (
            SNAKEITEMINDEX !== -1 &&
            this.props.Data.GameStatus !== "Не начата"
          ) {
            PlayAreaField =
              PlayAreaField +
              '<div class="PlayAreaSnakeDot" ><img class="PlayAreaDotPicture" src="img/' +
              this.props.Data.SnakePictures[SNAKEITEMINDEX] +
              '"/></div>';
          } else {
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
            } else {
              PlayAreaField =
                PlayAreaField + '<div class="PlayAreaEmptyDot"></div>';
            }
          }
        }
      }
      return PlayAreaField;
    };

    this.KeydownEventHandler = event => {
      switch (event.code) {
        case "ArrowUp":
          if (this.props.Data.ReverseDirection !== "up") {
            this.props.setSnakeDirectionUp();
          }
          break;
        case "ArrowDown":
          if (this.props.Data.ReverseDirection !== "down") {
            this.props.setSnakeDirectionDown();
          }
          break;
        case "ArrowLeft":
          if (this.props.Data.ReverseDirection !== "left") {
            this.props.setSnakeDirectionLeft();
          }
          break;
        case "ArrowRight":
          if (this.props.Data.ReverseDirection !== "right") {
            this.props.setSnakeDirectionRight();
          }
          break;
      }
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.KeydownEventHandler);
    const PLAYAREA_WIDTH = Math.trunc(
      this.PlayAreaDiv.current.clientWidth / this.props.Data.DotWidth
    );
    const PLAYAREA_HEIGHT = Math.trunc(
      this.PlayAreaDiv.current.clientHeight / this.props.Data.DotWidth
    );
    this.props.setWidth(PLAYAREA_WIDTH);
    this.props.setHeight(PLAYAREA_HEIGHT);
  }
  render() {
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
    } else {
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
    }
  })
)(PlayArea);
