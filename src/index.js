import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 渲染单独button
function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}
// 渲染了 9 个方块
class Board extends React.Component {

  renderSquare(i) {
    const className = this.props.winner ? (this.props.winner.includes(i) ? 'square gaoliang' : 'square') : 'square'
    return (
      <Square key={i} className={className}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />);
  }
  // 两个循环渲染棋盘的格子
  render() {
    const looper = Array(3).fill(null)
    var it = 0;
    return (
      <div>
        {
          looper.map((w) => {
            return (
              <div key={w} className="board-row">
                {
                  looper.map(() => {
                    return this.renderSquare(it++);
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}
// 渲染棋盘
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        // 落棋索引
        position: null,

      }],
      stepNumber: 0,
      xIsNext: true,

    }
  }
  handleClick(i) {
    // const history = this.state.history;
    // 确保回到过去之后未来的历史记录不正确
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // 判断棋盘是否已满或结束
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  sort() {
    this.setState({
      history: this.state.history.slice().reverse(),
    })
  }
  // 回到过去
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  // sort() {
  //   this.setState({
  //     history: this.state.history.slice().reverse(),
  //     reverse: !this.state.reverse,
  //     stepNumber: this.state.history.length - this.state.stepNumber - 1
  //   })
  // }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    // 渲染历史记录列表
    const moves = history.map((step, move) => {
      let className = '';
      const position = getPosition(step.position)
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      if (move === this.state.stepNumber) {
        className = 'current-step'
      } else { className = '' }
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>
            {desc}{position}
          </button>
        </li>
      );
    });
    // 判断是否平局
    let bothlose = (!current.squares.includes(null))
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (bothlose) {
      status = 'no body wins, 平局'
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board winner={winner} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <button onClick={() => { this.sort() }}>toggle</button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
// 判断出胜者
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      return lines[i]
    }
  }
  return null;
}
// 显示落棋位置
function getPosition(i) {
  if (typeof i === 'number') {
    let row = Math.floor(i / 3) + 1
    let column = 1 + i - (row - 1) * 3
    let position = '(' + column + ', ' + row + ')'
    return position
  } else { return '' }
}
