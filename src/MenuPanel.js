import React from "react";
import { connect } from "react-redux";

class MenuPanel extends React.Component {
  constructor(props) {
    super(props);
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
this.setDot=()=>{
  const LEFT= Math.floor(Math.random() * this.props.Data.Dimensions.width)+1
  const TOP= Math.floor(Math.random() * this.props.Data.Dimensions.height)+1
  
  const DOTTYPE= Math.floor(Math.random() *( this.props.Data.DotTypes.length))
  
  console.log(DOTTYPE)

  this.props.setDot(LEFT,TOP,DOTTYPE)
}

    this.SnakeActions = () => {
      let tempArray = [...this.props.Data.Snake.positions];
      let SnakeHead = tempArray[tempArray.length - 1];
      if (
        tempArray[tempArray.length - 1].left <= 1 ||
        tempArray[tempArray.length - 1].left >=
          this.props.Data.Dimensions.width ||
        tempArray[tempArray.length - 1].top <= 1 ||
        tempArray[tempArray.length - 1].top >= this.props.Data.Dimensions.height
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
              this.props.Data.Dot.position.top,this.props.Data.DotTypes[this.props.Data.Dot.DotType].score,this.props.Data.DotTypes[this.props.Data.Dot.DotType].picture
            );
            this.setDot();
          } else {
            this.props.setSnakePosition();
          }
        }
      }
    };
  }

  render() {
    return (
      <div className="MenuPanelWrapper">
        <div className="ScorePanel">
          <div className="ScorePanelTitle">Score </div>
          <div className="ScorePanelData">{this.props.Data.Score.Total} </div>
        </div>
        <div className="StatusPanel">
          <div className="StatusPanelTitle">Статус </div>
          <div className="StatusPanelData">{this.props.Data.GameStatus} </div>
        </div>
        <div className="LauncherPanel">
          <div
            className="LauncherPanelStart"
            onClick={this.menuActions}
            style={{
              display: this.props.Data.GameStatus !== "Начата" ? "flex" : "none"
            }}
          >
            Старт
          </div>{" "}
          <div
            className="LauncherPanelStop"
            onClick={this.menuActions2}
            style={{
              display: this.props.Data.GameStatus === "Начата" ? "flex" : "none"
            }}
          >
            Стоп
          </div>
        </div>
        <div className="OperatingWrapper">
          <div className="OperatingPanel">
            <div
              className="OperatingPanelUp"
              onClick={this.props.setSnakeDirectionUp}
            >
              <div className="ArrowUp"></div>
            </div>{" "}
            <div
              className="OperatingPanelLeft"
              onClick={this.props.setSnakeDirectionLeft}
            >
              <div className="ArrowLeft"></div>
            </div>
            <div
              className="OperatingPanelRight"
              onClick={this.props.setSnakeDirectionRight}
            >
              <div className="ArrowRight"></div>
            </div>
            <div
              className="OperatingPanelDown"
              onClick={this.props.setSnakeDirectionDown}
            >
              <div className="ArrowBottom"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({ Data: store }),
  dispatch => ({
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
    resetGame: () => {
      dispatch({ type: "RESET_GAME" });
    },
    pauseGame: () => {
      dispatch({ type: "PAUSE_GAME" });
    },
    gamoverGame: () => {
      dispatch({ type: "GAMOVER_GAME" });
    },
    resetSnake: () => {
      dispatch({ type: "SET_SNAKE_STARTPOSITION" });
    },
    increaseSnake: (left, top,increasement,picture) => {
      dispatch({ type: "INCREASE_SNAKE", left: left, top: top,increasement:increasement,picture:picture });
    },
    setDot: (left, top,DotType) => {
      dispatch({ type: "SET_NEW_DOT", left: left, top: top,DotType:DotType });
    }
  })
)(MenuPanel);
