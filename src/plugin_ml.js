// plugin_ml.js
const PluginML = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__ml = null
      sys.__ml_load = null
      sys.__ml_toString = null
    }
  },
  // @機械学習
  'SVM開': { // @機械学習のアルゴリズムSVMをパラメータOPTIONで開く。 OPTION={type,kernel,gamma,cost}// @SVMひらく
    type: 'func',
    josi: [['で']],
    fn: function (option, sys) {
      const SVM = require('libsvm-js/asm')
      // option
      if (option.type) { // default: C_SVC
      	option.type = SVM.SVM_TYPES[option.type]
      }
      if (option.kernel) { // default: RBF
      	option.kernel = SVM.KERNEL_TYPES[option.kernel]
      }
      const svm = new SVM(option)
      sys.__ml = svm
      sys.__ml_load = SVM.load
      sys.__ml_toString = function () {
      	return sys.__ml.serializeModel()
      }
      return sys.__ml
    }
  },
  'ランダムフォレスト開': { // @機械学習のアルゴリズムRandom ForestをOPTIONで開く。OPTION={seed,maxFeatures,replacement=(true|false),nEstimators} // @らんだむふぉれすとひらく
    type: 'func',
    josi: [['で']],
    fn: function (option, sys) {
      const RF = require('ml-random-forest').RandomForestClassifier
      const rf = new RF(option)
      sys.__ml = rf
      sys.__ml_load = function (str) {
      	const model = JSON.parse(str)
      	return RF.load(model)
      }
      sys.__ml_toString = () => {
      	const j = sys.__ml.toJSON()
      	const s = JSON.stringify(j)
      	return s
      }
      return sys.__ml
    }
  },
  'ランダムフォレスト回帰開': { // @機械学習のアルゴリズムRandom Forestの回帰をパラメータPARAMSで開く // @らんだむふぉれすとかいきひらく
    type: 'func',
    josi: [['で']],
    fn: function (params, sys) {
      const RF = require('ml-random-forest').RandomForestRegression
      const rf = new RF(params)
      sys.__ml_load = function (str) {
      	const model = JSON.parse(str)
      	return RF.load(model)
      }
      sys.__ml_toString = () => {
      	const j = sys.__ml.toJSON()
      	const s = JSON.stringify(j)
      	return s
      }
      return sys.__ml
    }
  },
  '学習': { // @入力配列inputsとラベル配列labelsで機械学習する // @がくしゅう
    type: 'func',
    josi: [['と'], ['で']],
    fn: function (inputs, labels, sys) {
      if (!sys.__ml || !sys.__ml.train) {
      	throw new Error('『学習』にて『SVM開』などで初期化してください。')
      }
      sys.__ml.train(inputs, labels) 
    },
    return_none: true
  },
  '予測': { // @入力配列inputsで予測し機械学習の結果を配列で返す // @よそく
    type: 'func',
    josi: [['で']],
    fn: function (inputs, sys) {
      if (!sys.__ml || !sys.__ml.predict) {
      	throw new Error('『予測』にて『SVM開』などで初期化してください。')
      }
      let a = sys.__ml.predict(inputs)
      return a
    }
  },
  'アヤメデータ取得': { // @アヤメデータをJSON形式で取得して返す // @あやめでーたしゅとく
    type: 'func',
    josi: [],
    fn: function (sys) {
      const a = require('./iris.json')
      return {
      	'データ': a['data'], 
      	'ラベル': a['label'], 
      	'ラベル名': a['name']
      }
    }
  },
  'モデル取得': { // @現在学習済みのモデルを取得する // @もでるしゅとく
    type: 'func',
    josi: [],
    fn: function (sys) {
      if (!sys.__ml_toString) {
      	throw new Error('『モデル設定』にて' + PLUGIN_ML_INIT_ERROR)
      }
      return sys.__ml_toString()
    }
  },
  'モデル設定': { // @現在学習済みのモデルMを設定する // @もでるせってい
    type: 'func',
    josi: [['を', 'の']],
    fn: function (m, sys) {
      if (!sys.__ml_load) {
      	throw new Error('『モデル設定』にて' + PLUGIN_ML_INIT_ERROR)
      }
      sys.__ml = sys.__ml_load(m)
      return sys.__ml
    }
  },
  'データランダム分割': { // @データとラベルの組をRATEで分割して{学習:{データ:[..],ラベル:[..]},テスト:{データ:[..],ラベル:[..]}}の形式で返す // @でーたらんだむぶんかつ
    type: 'func',
    josi: [['と'], ['を'], ['で']],
    fn: function (data, label, rate, sys) {
      // 組み合わせる
      const a = []
      for (let i = 0; i < data.length; i++) {
      	a[i] = {'data': data[i], 'label': label[i]}
      }
      // シャッフル
      a.sort( () => Math.random() - 0.5 )
      // レートで分ける
      if (rate >= 1.0) {
      	rate = 0.75 // デフォルト値
      }
      const n = Math.floor(a.length * rate)
      // 分割
      const res = {'学習':{'データ':[],'ラベル':[]}, 'テスト':{'データ':[], 'ラベル':[]}}
      const resTrain = res['学習']
      const resTest = res['テスト']
      for (let i = 0; i < a.length; i++) {
      	const fdata = a[i]['data']
      	const flabel = a[i]['label']
      	if (i < n) {
      	  resTrain['データ'].push(fdata)
      	  resTrain['ラベル'].push(flabel)
      	} else {
      	  resTest['データ'].push(fdata)
      	  resTest['ラベル'].push(flabel)
      	}
      }
      return res
    }
  },
  '正解率計算': { // @配列T(正解)とP(予測)の正解率を計算して返す // @せいかいりつけいさん
    type: 'func',
    josi: [['と'], ['の', 'で']],
    fn: function (t, p, sys) {
      let pc = 0
      for (let i = 0; i < t.length; i++) {
      	if (t[i] == p[i]) {
      		pc++
      	}
      }
      return pc / t.length
    }
  }
}

module.exports = PluginML

// scriptタグで取り込んだ時、自動で登録する
if (typeof (navigator) === 'object') 
  {navigator.nako3.addPluginObject('PluginML', PluginML)}


