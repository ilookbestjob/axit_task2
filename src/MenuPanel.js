import React from "react";
import { connect } from "react-redux";
//Компонент панель меню.Отображает текущий статус игры.
//В мобильной версии предоставляет графический интерфейс управления змейкой
class MenuPanel extends React.Component {
  constructor(props) {
    super(props);
    
  }
//Отрисовка компонента
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
        
          <div className="CountersWrapper"><div className="CountersHeader">Собрано {this.props.Data.Snake.positions.length-3}</div >
          {this.props.Data.Score.TypesCount.map(Type => (
            <div className="ContersData">
              <div>
                <img
                  className="CounterImage"
                  src={
                    "img/" + this.props.Data.DotTypes[Type.CountType].picture
                  }
                />
              </div>
              <div>
                х{Type.Score}=
                {Type.Score * this.props.Data.DotTypes[Type.CountType].score}
              </div>
            </div>
          ))}
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
              className="OperatingPanelDown"
              onClick={this.props.setSnakeDirectionDown}
            >
              <div className="ArrowBottom"></div>
            </div>
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
           
          </div>
        </div>
      </div>
    );
  }
}
//Подключение к store
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
    }
   
  })
)(MenuPanel);
