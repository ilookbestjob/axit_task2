import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

class PlayArea extends React.Component {
  constructor(props) {
    super(props);
this.SnakeItemIndex=(PlayAreaCol, PlayAreaRow)=>
  this.props.Data.Snake.positions.findIndex(
    SnakePosition =>
      SnakePosition.left === PlayAreaCol &&
      SnakePosition.top === PlayAreaRow
  )



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
          const SNAKEITEMINDEX=this.SnakeItemIndex(PlayAreaCol, PlayAreaRow)
          if ((
            SNAKEITEMINDEX!== -1
          )&&(this.props.Data.GameStatus!=="Не начата")) {
            PlayAreaField =
              PlayAreaField + '<div class="PlayAreaSnakeDot"><img class="PlayAreaDotPicture" src="img/'+ this.props.Data.SnakePictures[ SNAKEITEMINDEX]+'"/></div>';
          } else {
            if (
              this.props.Data.Dot.position.left === PlayAreaCol &&
              this.props.Data.Dot.position.top === PlayAreaRow
            ) {
            
              PlayAreaField = PlayAreaField + '<div class="PlayAreaDot"><img class="PlayAreaDotPicture" src="img/'+ this.props.Data.DotTypes[this.props.Data.Dot.DotType*1].picture+'"></div>';
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
          if (this.props.Data.ReverseDirection!=="up"){
            this.props.setSnakeDirectionUp();}
         break;
         case "ArrowDown":
          if (this.props.Data.ReverseDirection!=="down"){
            this.props.setSnakeDirectionDown();}
         break;
         case "ArrowLeft":
          if (this.props.Data.ReverseDirection!=="left"){
            this.props.setSnakeDirectionLeft();}
         break;
         case "ArrowRight":
          if (this.props.Data.ReverseDirection!=="right"){
            this.props.setSnakeDirectionRight();}
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
