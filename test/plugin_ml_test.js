const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginML = require('../src/plugin_ml')

describe('ml_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginML', PluginML)
  // console.log(nako.gen.plugins)
  // nako.debug = true
  const cmp = (code, res) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.equal(nako.runReset(code).log, res)
  }
  const cmd = (code) => {
    if (nako.debug) console.log('code=' + code)
    nako.runReset(code)
  }
  // --- test ---
  it('表示', () => {
    cmp('3を表示', '3')
  })
  const srcJSON = "AをJSONエンコードして表示。\n"
  const srcTrainXOR = "[[0, 0], [1, 1], [1, 0], [0, 1]]と[0,0,1,1]で学習\n"
  it('SVM', () => {
  	// XORテスト
  	const srcSVM = "{}でSVM開く\n" + srcTrainXOR
  	const train0 = srcSVM + "A=[[0,0]]で予測。\n" + srcJSON
    cmp(train0, '[0]')
  	const train1 = srcSVM + "A=[[0,0],[1,1],[1,0]]で予測。\n" + srcJSON
    cmp(train1, '[0,0,1]')
  })
  it('SVMモデル設定', () => {
  	const src = "{}でSVM開く\n" +
  		srcTrainXOR +
  		"J=モデル取得\n" +
  		"{}でSVM開く。\n" +
  		"Jのモデル設定\n" +
  		"A=[[0,0],[1,0]]で予測。\n" + srcJSON
    cmp(src, '[0,1]')
  })

  it('ランダムフォレスト', () => {
  	// irisテスト
  	const srcRF = "{}でランダムフォレスト開く\n" + 
  		"Y=アヤメデータ取得。\n" +
  		"Y['データ']とY['ラベル']で学習。\n" +
  		"A=[[5.1,3.5,1.4,0.2],[5.9,3,5.1,1.8]]で予測。\n" + 
  		srcJSON
  	cmp(srcRF, "[0,2]")
  })
  it('ランダムフォレストモデル設定', () => {
  	const srcRF = "{}でランダムフォレスト開く\n" + 
  		"Y=アヤメデータ取得。\n" +
  		"Y['データ']とY['ラベル']で学習。\n" +
  		"J=モデル取得。\n" +
  		"{}でランダムフォレスト開く\n"+
  		"Jのモデル設定。\n" +
  		"A=[[5.1,3.5,1.4,0.2],[5.9,3,5.1,1.8]]で予測。\n" + 
  		srcJSON
  	cmp(srcRF, "[0,2]")
  })
  it('正解率計算', () => {
  	const src1 = "[1,1,1]と[1,1,1]で正解率計算して表示"
  	const prd1 = "1"
  	cmp(src1, prd1)
  	const src2 = "[1,1,1,1]と[1,1,0,0]で正解率計算して表示"
  	const prd2 = "0.5"
  	cmp(src2, prd2)
  })
  it('データランダム分割', () => {
  	const src = "" + 
  		"Y=アヤメデータ取得。YC=Y['データ']の要素数。\n" +
  		"R=Y['データ']とY['ラベル']を0.8でデータランダム分割\n" +
  		"GC=R['学習']['データ']の要素数。\n" +
  		"AC=YC*0.8;もし、GC=ACならば「OK」と表示。違えば「NG:{GC}:{AC}」を表示。"
  	cmp(src,'OK')
  	/*
  	// シャッフルが偏ってしまう？
  	const src2 = "" + 
  		"Y=アヤメデータ取得。\n" +
  		"R1=Y['データ']とY['ラベル']を0.8でデータランダム分割\n" +
  		"R2=Y['データ']とY['ラベル']を0.8でデータランダム分割\n" +
  		"A1=R1['学習']['ラベル'][0];\n" +
  		"A2=R2['学習']['ラベル'][0];\n"+
  		"もし、A1=A2ならば\n"+
  		"  「NG」と表示。\n"+
  		"違えば\n" +
  		"　　「OK」と表示。\n" +
  		"ここまで。"
  	cmp(src2,'OK')
  	*/
  })
  it('アヤメ予測/ランダムフォレスト', () => {
  	const srcRF = "{}でランダムフォレスト開く\n" + 
  		"Y=アヤメデータ取得。\n" +
  		"R=Y['データ']とY['ラベル']を0.8でデータランダム分割\n" +
  		// "R['学習']['データ']の要素数を表示。"+
  		// "R['テスト']['データ']の要素数を表示。"+
  		"R['学習']['データ']とR['学習']['ラベル']で学習。\n" +
  		"PRED=R['テスト']['データ']で予測。\n" + 
  		"R['テスト']['ラベル']とPREDで正解率計算してAに代入。\n" +
  		"もし、Aが0.9以上ならば「OK」と表示。違えば「NG:{A}」と表示。"
  	cmp(srcRF, "OK")
  })
  it('アヤメ予測/SVM', () => {
  	const src = "{'kernel':'RBF', 'type':'C_SVC'}でSVM開く\n" + 
  		"Y=アヤメデータ取得。\n" +
  		"R=Y['データ']とY['ラベル']を0.8でデータランダム分割\n" +
  		"R['学習']['データ']とR['学習']['ラベル']で学習。\n" +
  		"PRED=R['テスト']['データ']で予測。\n" + 
  		"R['テスト']['ラベル']とPREDで正解率計算してAに代入。\n" +
  		"もし、Aが0.9以上ならば「OK」と表示。違えば「NG:{A}」と表示。"
  	cmp(src, "OK")
  })
  it('アヤメ予測/SVM/モデル設定', () => {
  	const src = "{}でSVM開く\n" + 
  		"Y=アヤメデータ取得。\n" +
  		"R=Y['データ']とY['ラベル']を0.8でデータランダム分割\n" +
  		"R['学習']['データ']とR['学習']['ラベル']で学習。\n" +
        "M=モデル取得。\n" +
        "{}でSVM開く。\n" +
        "Mのモデル設定。\n" +
  		"PRED=R['テスト']['データ']で予測。\n" + 
  		"R['テスト']['ラベル']とPREDで正解率計算してAに代入。\n" +
  		"もし、Aが0.9以上ならば「OK」と表示。違えば「NG:{A}」と表示。"
  	cmp(src, "OK")
  })
})





