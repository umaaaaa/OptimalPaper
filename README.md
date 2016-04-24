# [KININARU](http://kininaru.site)
![](https://github.com/umaaaaa/OptimalPaper/blob/master/public/images/logo.png)

## サービス説明
- みんなと論文を読もう！

### 機能
- 論文検索
- 論文に対するコメントや評価の
- 読んだ論文をシェア
- おすすめ論文の提示

## 開発に使用したもの
- [Node.js](https://nodejs.org/en/) v4.4.x

## インストール方法
まずはProjectをcloneしましょう

```
$ git clone git@github.com:umaaaaa/OptimalPaper.git
```
## 開発
プロジェクトのディレクトリに移動し、

```
$ npm install #初回のみ
$ brew install mysql
$ mysql.server start
$ mysql -uroot
 > CREATE USER optimalpaper;
$ mysql -uroot < db/create.sql
$ mysql -uroot optimalpaper < db/setup.sql
$ npm start
```

`localhost:3000`で動きます。
