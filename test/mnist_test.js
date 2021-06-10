const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginML = require('../nadesiko3-ml.js')

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
  const srcJSON = "AをJSONエンコードして表示。\n"
  const srcTrainXOR = "[[0, 0], [1, 1], [1, 0], [0, 1]]と[0,0,1,1]で学習\n"
  const mnistFile = __dirname + "/mnist-1k.json"
  const modelFile = __dirname + "/mnist.model"
  it('SVM.save', function (done) {
    this.timeout(1000 * 60)
  	const src = "{'kernel':'RBF', 'type':'C_SVC'}でSVM開く\n" + 
  		"「" + mnistFile + "」を開いて、JSONデコードして、Yに代入。\n" +
  		"R=Y['data']とY['label']を0.8でデータランダム分割\n" +
  		"R['学習']['データ']とR['学習']['ラベル']で学習。\n" +
        "M=モデル取得。「" + modelFile + "」へMを保存。\n" +
  		"PRED=R['テスト']['データ']で予測。\n" + 
  		"R['テスト']['ラベル']とPREDで正解率計算してAに代入。\n" +
  		"もし、Aが0.7以上ならば「OK」と表示。違えば「NG:{A}」と表示。"
    setTimeout(function(){
        cmp(src, "OK")
        done()
    },1)
  })
  it('SVM.load', function (done) {
    this.timeout(1000 * 60)
  	const src = "{}でSVM開く\n" + 
  		"「" + modelFile + "」を開いてMに代入。\n" +
  		"Mをモデル設定。\n" +
  		"「" + mnistFile + "」を開いて、JSONデコードして、Yに代入。\n" +
  		"PRED=Y['data']で予測。\n" +
  		"Y['label']とPREDで正解率計算してAに代入。\n" +
  		"もし、Aが0.7以上ならば「OK」と表示。違えば「NG:{A}」と表示。"
    setTimeout(function(){
        cmp(src, "OK")
        done()
    },1)
  })
})





