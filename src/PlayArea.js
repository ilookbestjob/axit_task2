import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

class PlayArea extends React.Component {
  constructor(props) {
    super(props);
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
          if ((
            this.props.Data.Snake.positions.findIndex(
              SnakePosition =>
                SnakePosition.left === PlayAreaCol &&
                SnakePosition.top === PlayAreaRow
            ) !== -1
          )&&(this.props.Data.GameStatus!=="Не начата")) {
            PlayAreaField =
              PlayAreaField + '<div class="PlayAreaSnakeDot"></div>';
          } else {
            if (
              this.props.Data.Dot.position.left === PlayAreaCol &&
              this.props.Data.Dot.position.top === PlayAreaRow
            ) {
              PlayAreaField = PlayAreaField + '<div class="PlayAreaDot"></div>';
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
            this.props.setSnakeDirectionUp();
         break;
         case "ArrowDown":
            this.props.setSnakeDirectionDown();
         break;
         case "ArrowLeft":
            this.props.setSnakeDirectionLeft();
         break;
         case "ArrowRight":
            this.props.setSnakeDirectionRight();
         break;
      }

    };
  }

  componentDidMount() {
   
    window.addEventListener("keydown", this.KeydownEventHandler);
    //useEventListener('keydown', KeydownEventHandler)
  }
  render() {
    return (
      <div
        className="PlayArea"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(" + this.props.Data.Dimensions.width + ",1fr)"
        }}
      >
        {ReactHtmlParser(this.GET_AREA())}
      </div>
    );
  }
}

export default connect(
  store => ({
    Data: store
  }),
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
    }
  })
)(PlayArea);
