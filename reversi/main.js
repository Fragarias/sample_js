const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");

const stoneStateList = []; //配列定義

let currentColor = 1;
const currentTurnText = document.getElementById("current-turn");
const getReversibleStones = (idx) => {
  // クリックしたマスから見て、各方向にマスがいくつあるかをあらかじめ計算する
  const squareNums = [
    7 - (idx % 8),
    Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
    (56 + (idx % 8) - idx) / 8,
    Math.min(idx % 8, (56 + (idx % 8) - idx) / 8),
    idx % 8,
    Math.min(idx % 8, (idx - (idx % 8)) / 8),
    (idx - (idx % 8)) / 8,
    Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8),
  ];
  // for文ループの規則を決めるためのパラメータ定義
  const parameters = [1, 9, 8, 7, -1, -9, -8, -7];

  // ひっくり返せる事が確定した石の情報をいれる配列
  let results = [];

  //8方向への走査のためのfor文(右横から時計回り)
  for (let i = 0; i < 8; i++) {
    const box = []; //ひっくり返せる可能性のある石の情報を入れる配列
    const squareNum = squareNums[i]; //現在調べている方向にいくつますがあるか
    const param = parameters[i];
    const nextStoneState = stoneStateList[idx + param]; //ひとつ隣の石の状態

    // (隣の石があるか) もしくは (隣の石が相手の色か)
    if (nextStoneState === 0 || nextStoneState === currentColor) continue; //次のループへ
    box.push(idx + param); //隣の石の番号を仮ボックスに格納

    // 延長線上に石があるか 延長線上の石が相手の色か
    for (let j = 0; j < squareNum - 1; j++) { //ループ回数は予め定義したマスの数による
      const targetIdx = idx + param * 2 + param * j;
      const targetColor = stoneStateList[targetIdx];
      if (targetColor === 0) continue; //さらに隣に石があるか
      if (targetColor === currentColor) { //さらに隣にある石が自分の色か
        // 自分の色の場合
        results = results.concat(box);
        break; //for文の終了
      } else {
        // 相手の色の場合
        box.push(targetIdx);
      }
    }
  }
  // ひっくり返せると確定した石の番号を戻り値にする
  return results;
};

const onClickSquare = (index) => {
  //  ひっくり返せる石の数を取得
  const reversibleStones = getReversibleStones(index);

  //(既に石がある) もしくは (ひっくり返せる石がない)
  if (stoneStateList[index] !== 0 || !reversibleStones.length) {
    alert("ここには置けないよ！");
    return;
  }

  // 自分の石を置く
  stoneStateList[index] = currentColor;
  document
    .querySelector(`[data-index='${index}']`)
    .setAttribute("data-state", currentColor);

  // 相手の石をひっくり返す(stoneStateListおよびHTML要素の状態を現在のターンの色に変更する)
  reversibleStones.forEach((key) => {
    stoneStateList[key] = currentColor;
    document.querySelector(`[data-index='${key}']`).setAttribute("data-state", currentColor);
  });

  // もし盤面がいっぱいだったら、集計してゲームを終了
  if (stoneStateList.every((state) => state !== 0)) {
    const blackStonesNum = stoneStateList.filter(state => state === 1).length;
    const whiteStonesNum = 64 - whiteStonesNum;

    let winnerText = "";
    if (blackStonesNum > whiteStonesNum) {
      winnerText = "黒の勝ちです！";
    } else if (blackStonesNum < whiteStonesNum) {
      winnerText = "白の勝ちです！";
    } else {
      winnerText = "引き分けです！";
    }
    alert(`ゲーム終了です。白${whiteStonesNum}、黒${blackStonesNum}で、${winnerText}`)
  }

   // ゲーム続行なら相手のターンにする
   currentColor = 3 - currentColor; //currentColorが1なら2、2なら1になる

   if (currentColor === 1) {
     currentTurnText.textContent = "黒";
   } else {
     currentTurnText.textContent = "白";
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