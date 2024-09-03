# nadesiko3-ml

Machine Learning for Nadesiko3

なでしこ3のための機械学習ライブラリ。

## ライブラリの簡単な使い方

XORのデータを学習する場合は以下の通り。

```
XORデータ=[[0, 0], [1, 1], [1, 0], [0, 1]]
XORラベル=[0,0,1,1]

# --- SVMを使う場合 ---
{}でSVM開く
# 学習
XORデータとXORラベルで学習。
# 予測
A=[[0,0],[1,1],[1,0]]で予測
AをJSONエンコードして表示。# [0,0,1]
```

Iris(アヤメ)データの学習をする場合。

```
{'kernel':'RBF', 'type':'C_SVC'}でSVM開く

# Irisデータを取得して、ランダムに分割する
Y=アヤメデータ取得。
R=Y['データ']とY['ラベル']を0.8でデータランダム分割
# 学習
R['学習']['データ']とR['学習']['ラベル']で学習。
# 予測
PRED=R['テスト']['データ']で予測。
# 正解率を求める
R['テスト']['ラベル']とPREDで正解率計算して表示。
```

## ランダムフォレストを使う場合

```
{}でランダムフォレスト開く

# Irisデータを取得して、ランダムに分割する
Y=アヤメデータ取得。
R=Y['データ']とY['ラベル']を0.8でデータランダム分割
# 学習
R['学習']['データ']とR['学習']['ラベル']で学習。
# 予測
PRED=R['テスト']['データ']で予測。
# 正解率を求める
R['テスト']['ラベル']とPREDで正解率計算して表示。
```

# なでしこのインストールとプラグインの設定

Node.jsで使う人は、以下のような感じにします。

```
# インストール
npm install nadesiko3
npm install nadesiko3-ml

# サンプルを実行
$ npm exec cnako3 node_modules/nadesiko3-ml/example/svm-xor.nako3
$ npm exec cnako3 node_modules/nadesiko3-ml/example/rf-iris.nako3
```

# 手書き数字の認識デモを実行

以下を実行する

```
cnako3 demo/mnist-server/mnist-server.nako3
```





