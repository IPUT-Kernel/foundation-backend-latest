[![](https://img.shields.io/github/license/IPUT-Kernel/foundation-backend?color=yellow&style=plastic)](LICENSE)

## 概要
このプロジェクトは、学生が管理することを主体においた、大学生活をより豊かで効率的にするソーシャルプラットフォームである。

## Quick start
**サーバー起動**<br>
`make run`<br>
**サーバー停止**<br>
`make down`<br>

**APIドキュメント**<br>
| 名称               | URL                     |
|-------------------|-------------------------|
| Swagger Editor     | http://localhost:8001/  |
| Swagger UI         | http://localhost:8002/  |
| Swagger API mock   | http://localhost:8003/~~ |

## 概要
このプロジェクトは、学生が管理することを主体においた、大学生活をより豊かで効率的にするソーシャルプラットフォームである。

## 要件一覧
１．すべてのユーザーは基本的に匿名及び実名を意図的に選択できる

２．すべてのユーザーは学年、クラスや専攻など、自分自身の所属を証明する手段を持つ

３．特定のドメインの人間しか登録することは不可能

４．ユーザーはそれぞれ６段階の認証レベルが振り分けられており、デフォルトは、

* ゲスト：０ 

* 学校関連者：１ 

* 学生：２ 

とする。

５．3~5以上になると、

* ３以上：クラスのメンバーや、時間割を編集する権限 

* ４以上：時間割に利用する科目を編集する権限 ３人まで他のユーザーを認証レベル３として保証することができる。

* ５以上：管理者と同等の権限を持つ 悪質なユーザーのBANや、匿名の剥奪をする権利 ３人まで他のユーザーを認証レベル４として保証することができる。

    
というようにアクセスできる領域が増える。

６．どの学生がどのクラスにいるなどの情報は、必ず１以上のユーザーしかアクセスできない。

７．基本的なレイアウトはダッシュボード形式になっており、その内容は学生やそのコミュニティーが作成し、管理者が承諾したらマージする。

８．初期で入っているのはデータベース管理のフォームと、時間割・イベント・自習 談話室を確認できるダッシュボードと、SNSには必ずあると言っていいPostやプロフィールなどの機能と、VOSの代替となり得る存在、落とし物用の掲示板である。

   これらはslack等で事足りるものであるが、重要なのはこれらの情報がデータベースの情報をもとに、能動的に情報が整理され、かつ学生側がそれらに自由にアクセスできることにある。
   
## 技術選定

### アプリケーション

Node.js Express 

### データベース

MongoDB

### インフラ
データベースサーバー以外はすべてDockerコンポーネントにし、管理者の自宅にあるサーバーにデプロイ

データベースサーバーのみAWS Atlasで管理する
