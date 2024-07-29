const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");

const stoneStateList = []; //配列定義

const onClickSquare = (index) => {
  if (stoneStateList[index] !== 0) { //既に石が置かれている
    alert("ここには置けないよ！");
    return;
  }
}

const createSquares = () => {
  for (let i = 0; i < 64; i++) {
    const square = squareTemplate.cloneNode(true); //テンプレートから要素をクローン
    square.removeAttribute("id"); //テンプレート用のid属性を削除
    stage.appendChild(square); //マス目のHTML要素を盤に追加

    const stone = square.querySelector('.stone');

    let defaultState; //盤上各マスの石の状態定義
    // iの値によって石の状態を分岐
    if (i == 27 || i == 36) {
      defaultState = 1; //黒
    }else if(i == 28 || i ==35){
      defaultState = 2; //白
    }else{
      defaultState = 0; //石を置いていない状態
    }
    stone.setAttribute("data-state", defaultState);
    stone.setAttribute("data-index", i); //インデックス番号をHTML要素に保持させる
    stoneStateList.push(defaultState); //初期値を配列に格納

    square.addEventListener('click', () => {
      onClickSquare(i);
    })
  }
};

window.onload = () => {
  createSquares();
};