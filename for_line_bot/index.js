'use strict';
//モジュールのインポート
const line = require('@line/bot-sdk');//LINEのMessaging APIのクライアントライブラリ
const request = require('request');//Node.jsのrequestモジュール

//パラメーター設定
const config = {
  channelSecret: process.env.channelSecretLINE,
  channelAccessToken: process.env.channelAccessTokenLINE
};

const client = new line.Client(config);//クライアントとしてラインを定義
const sunabarToken = process.env.sunabarToken;
const sunabarTokenChild = process.env.sunabarTokenChild;
const remindToken1 = process.env.remindToken1;
const remindToken2 = process.env.remindToken2;
const remindToken3 = process.env.remindToken3;
const moneyInfoToken = process.env.moneyInfoToken;

const oyaSpAccountId = process.env.oyaSpAccountId;
const techmaSpAccountId = process.env.techmaSpAccountId;
const kyoyuSpAccountId = process.env.kyoyuSpAccountId;

console.log("oyaSpAccountId:",oyaSpAccountId);
console.log("techmaSpAccountId:",techmaSpAccountId);
console.log("kyoyuSpAccountId:",kyoyuSpAccountId);

const stampList = [
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979904, //OK
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979908, //ぬくぬく
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979909, //もしもし
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979910, //ふぅ
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979911, //やくそく
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979912, //ありがと
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979914, //おつかれ
  },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581260, //おはよう
  //   },
  {
    type: "sticker",
    packageId: 8515,
    stickerId: 16581242, //OKでーす
  },
  {
    type: "sticker",
    packageId: 8515,
    stickerId: 16581243, //ありがとうございます
  },
  {
    type: "sticker",
    packageId: 8515,
    stickerId: 16581253, //ハート
  },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581261, //おやすみなさい
  //   },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581254, //さすがです
  //   },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581258, //うーん
  //   },
  {
    type: "sticker",
    packageId: 11538,
    stickerId: 51626518, //くま
  },
  {
    type: "sticker",
    packageId: 11538,
    stickerId: 51626503, //くま
  },
];  

const chatComments = [
  "お得なつもりの無駄遣いしてませんか？割引シールがついていると、つい手が伸びる・・・でも、本当に必要か一度考えましょう！",
  "エアコンはこまめにオフは間違い！？エアコンは電源を入れた瞬間に多くの電力を消費します。光熱費節約のつもりでこまめに電源をオフにすると、かえって電気代がかさむことも多いようです。効率的に室内を快適な温度にするには、自動運転とサーキュレーション！",
  "食費節約のポイントはまとめ買いです！1週間分のメニューをざっくりと考え、必要なものを書き出してから買い物に行くと、無駄使いを予防できますよ！",
  "家庭の電気使用量のうち約15％を占めるのが冷蔵庫です。設定温度を「強」から「中」に変えるだけで、年間1,360円ほど節約することが可能です。",
  "固定費とは、使う・使わないに限らず、毎月決まってかかる出費のことです。固定費節約のポイントは、大きな出費から見直すことです。",
  "お金を貯めたい人は3つの口座を持つのがオススメ!「使う口座」「イベント用口座」そして「貯金専用口座」です。",
];

const lunchTimeInfo = [
  "はじめての投資のためのやさしい話の紹介です。https://www.daiwa.jp/ja/dd/beginner/",
  "ふるさと納税を始めてみませんか？https://www.furusato-tax.jp/about",
  "ネット銀行が気になっていませんか？！https://life.oricon.co.jp/rank_netbank/special/knowledge-how-to-choose/difference/",
  "子どもへの金融教育は大切です！https://www.fsa.go.jp/teach/shougakusei.html",
  "次世代を担う銀行「GMOあおぞらネット銀行」https://gmo-aozora.com",
  "積立NISAが気になっていませんか？？https://moneiro.jp/media/article/tumitate-nisa",
  "投資に関するオススメ書籍です。https://rank-king.jp/article/16763",
  "つかいわけ口座とは？https://gmo-aozora.com/support/guide/purpose.pdf",
  "今すぐ活用したい！自動振込サービスhttps://life.oricon.co.jp/rank_netbank/news/2085709/",
  "節約に関するオススメ書籍です。https://monoblog.jp/archives/16621",
  "iDecoが気になっていませんか？https://www.ideco-koushiki.jp/guide/"
]
const getRandomElem = (array) => {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
};


// Webhookは、イベント発生をトリガにして送信側がデータを送出する  
exports.handler = (event) => {
    console.log("event : ", event);
    if (event.body === undefined ) {
        
        console.log("イベントのタイプは？", typeof event);//object
        console.log("EventBrisge : ",event.resources[0]);
    
        let remaind =event.resources[0];//エラー
        console.log("remaind : ",remaind);
    
     
        //remind1:体温チェック
        if (remaind == remindToken1) {
            return client.pushMessage(process.env.USER_ID, 
        
             {
              'type': 'text',
              'text': '体温チェックしましたか？'
             });
        
        //remind2：水やり
        } else if (remaind == remindToken2) {
            return client.pushMessage(process.env.USER_ID, 
              {
              'type': 'text',
              'text': '水やりしましたか？'
              }); 
        
        //remind3：食洗機
        } else if (remaind == remindToken3) {
            return client.pushMessage(process.env.USER_ID, 
              {
              'type': 'text',
              'text': '食洗機のスイッチ入れましたか？'
              });
        //moneyInfo:お昼の記事紹介     
        } else if (remaind == moneyInfoToken) {
            const information =  getRandomElem(lunchTimeInfo);
            return client.pushMessage(process.env.USER_ID,
              {
                'type': 'text',
                'text': information
              });
        };
    } else {
       
        const replyToken = JSON.parse(event.body).events[0].replyToken;
    
        let reqMessage = JSON.parse(event.body).events[0].message.text;
        let resMessage = "";
        let reqStampChecker = JSON.parse(event.body).events[0].message.type;

        if (reqStampChecker === "sticker") {
            return client.replyMessage(replyToken, getRandomElem(stampList));
        }
        // 現在の時間（日本）2022-09-01の表示の仕方で取得する => 振込APIに必要
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const monthTwoDigits = month.toString().padStart(2, "0");
        const dayTwoDigits = day.toString().padStart(2, "0");
        const dateForApi = year + '-' + monthTwoDigits + '-' + dayTwoDigits
        // console.log(dateForApi);//2202-09-01 ok
        // console.log("タイプは? : ",typeof dateForApi);//string
    
       if (reqMessage == "おはよう") {
           return client.replyMessage(replyToken, 
             {
             type: "sticker",
             packageId: 8515,
             stickerId: 16581260, //おはよう
             });
       }
       if (reqMessage == "おやすみ") {
           return client.replyMessage(replyToken, 
             {
             type: "sticker",
             packageId: 8515,
             stickerId: 16581261, //おやすみなさい
             });
       }
       if (reqMessage == "疲れたよ") {
           return client.replyMessage(replyToken, 
             {
             type: "sticker",
             packageId: 6325,
             stickerId: 10979914, //おつかれ
             });
       }

       if (reqMessage == "教えて") {
           return client.replyMessage(replyToken, 
             {
             type: "text",
             text: getRandomElem(chatComments),
             });
        
       } 
    
       if (reqMessage == '残高') {
        //口座残高照会のリクエストAPI
           var options1 = {
                          'method': 'GET',
                          'json':'true',
                          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
                          'headers': {
                                     'Accept': 'application/json;charset=UTF-8',
                                     'Content-Type': 'application/json;charset=UTF-8',
                                     'x-access-token': sunabarToken
                                     }
            };
           request(options1, function (error, response) {
             if (error) throw new Error(error);
  
             const data = response.body;
             //口座残高の数値化
             const balanceResponse = parseInt(data.balances[0].balance, 10);
             console.log("残高 : ",balanceResponse);
     
             resMessage = `残高は${balanceResponse.toLocaleString()}円です。`;

             return client.replyMessage(
               replyToken, 
               {
               'type': 'text',
               'text': resMessage
               });
            });

        }else if (reqMessage == 'テックまの残高') {
           //テックまの口座残高照会のリクエストAPI
           var options2 = {
                          'method': 'GET',
                          'json':'true',
                          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
                          'headers': {
                                     'Accept': 'application/json;charset=UTF-8',
                                     'Content-Type': 'application/json;charset=UTF-8',
                                     'x-access-token': sunabarTokenChild
                           }
            };

            request(options2, function (error, response) {
              const data = response.body;
              //テックまの口座残高の数値化
              const balanceResponse = parseInt(data.balances[0].balance, 10);
              console.log("テックまの残高 : ",balanceResponse);
              resMessage = `テックまの残高は${balanceResponse.toLocaleString()}円です。`;

              try{ 
                if (error) {
                  throw new Error('テックまが、あなたを認可していない可能性があります。');
                }
                return client.replyMessage(
                  replyToken, 
                  {
                  'type': 'text',
                  'text': resMessage
                  });
              } catch (error) {
                console.error( "エラー：", error.message );
                resMessage = error.message;
                
                return client.replyMessage(
                  replyToken, 
                  {
                    'type': 'text',
                    'text': resMessage
                  });
                }  
            });

        } else if (reqMessage == '共有の残高') {
            //口座残高照会のリクエストAPI
            var options3 = {
                           'method': 'GET',
                           'json':'true',
                           'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
                           'headers': {
                                      'Accept': 'application/json;charset=UTF-8',
                                      'Content-Type': 'application/json;charset=UTF-8',
                                      'x-access-token': sunabarToken
                           }
             };
            request(options3, function (error, response) {
              if (error) throw new Error(error);
                //   console.log(response.body);
                //   const data =  JSON.parse(response.body);
                  const data = response.body;
                  //使い分け口座（夫婦共有）の残高の数値化
                  const shareAccountBalance = parseInt(data.spAccountBalances[2].odBalance, 10);
                  console.log("共有口座の残高 : ",shareAccountBalance);
     
                  resMessage = `共有口座の残高は${shareAccountBalance.toLocaleString()}円です。`;

                  return client.replyMessage(
                    replyToken, 
                    {
                    'type': 'text',
                    'text': resMessage
                    });
            });

        } else if (reqMessage.indexOf('おこづかい') !== -1 ) {
     
            let transferAmountArray = reqMessage.split('円');
            console.log(transferAmountArray);
            const transferAmount = transferAmountArray[0]; 
            console.log("transferAmount : ", typeof transferAmount);//string
    
            //自分のつかいわけ口座（テックま）からテックまの口座に指定額振込
            var options = {
                          method: 'POST',
                          url: 'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/request',
                          headers: {
                                  'Accept': 'application/json;charset=UTF-8',
                                  'Content-Type': 'application/json',
                                  'x-access-token': sunabarToken
                          },
                          body: {
                                accountId: "301010005081",
                                remitterName: 'ｽﾅﾊﾞ ﾃﾙｵ',
                                transferDesignatedDate: dateForApi,
                                transferDateHolidayCode: '1',
                                totalCount: '1',
                                totalAmount: transferAmount,
                                transfers: 
                                         [ {
                                           itemId: 1,
                                           transferAmount: transferAmount,
                                           beneficiaryBankCode: '0310',
                                           beneficiaryBranchCode: '101',
                                           accountTypeCode: '1',
                                           accountNumber: "0005067",
                                           beneficiaryName:"ｽﾅﾊﾞﾅｵｷ"
                                           } ]
                          },
                          json: true
            };
    
            request(options, function (error, response) {
              console.log("test1");
              if (error) throw new Error(error);
                  console.log("test2");
                  console.log("response.body : ", response.body);
                  //振込の受付番号（applyNo)を定数宣言
                  console.log("受付番号: ",response.body.applyNo);
          
                  resMessage = `受付番号：${response.body.applyNo}で\nおこづかい${transferAmountArray[0].toLocaleString()}円振込受付完了しました。\nログインしてお知らせからパスワードを入力してください。\nhttps://gmo-aozora.com/pfbank/sunabarinfo.html`;

                  return client.replyMessage(
                    replyToken, 
                    {
                    'type': 'text',
                    'text': resMessage
                    });
            });

        //どの口座にいくら振り替えるかを指定
        }  else if (reqMessage.indexOf('テックま振替') !== -1 ) {
            
             let amountArray = reqMessage.split("円");
            //  console.log("[amountArray]", amountArray);
             const amount = amountArray[0];
            //  console.log("[amount]のタイプは？", typeof amount);
             var options = {
                           'method': 'POST',
                           'json': 'true',
                           'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer',
                           'headers': {
                                      'Accept': 'application/json;charset=UTF-8',
                                      'Content-Type': 'application/json;charset=UTF-8',
                                      'x-access-token': sunabarToken
                           },
                           body: {
                                 "depositSpAccountId":techmaSpAccountId,
                                 "debitSpAccountId":oyaSpAccountId,
                                 "currencyCode":"JPY",
                                 "paymentAmount":amount
                           }
              };

              request(options, function (error, response) {
                if (error) throw new Error(error);
                    console.log(response.body);
                    const data = response.body;
                    console.log("data:", data);
           
                    var options = {
                                  'method': 'GET',
                                  'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
                                  'headers': {
                                             'Accept': 'application/json;charset=UTF-8',
                                             'Content-Type': 'application/json;charset=UTF-8',
                                             'x-access-token': sunabarToken
                                   }
                     };
                 request(options, function (error, response) {
                   if (error) throw new Error(error);
                       console.log(response.body);
                       const data = JSON.parse(response.body);
                       const balanceOya = parseInt(data.spAccountBalances[0].odBalance, 10); 
                       const balanceTechma = parseInt(data.spAccountBalances[1].odBalance, 10);
          
                       resMessage = `振替しました。\n親口座の残高は、${balanceOya.toLocaleString()}円です。\nつかいわけ口座（テックま）の残高は、${balanceTechma.toLocaleString()}円です。`;

                       return client.replyMessage(
                         replyToken, 
                         {
                         'type': 'text',
                         'text': resMessage
                         });
                 });  
              });
   
        } else if (reqMessage.indexOf('共有振替') !== -1 ) {
          
            let amountArray = reqMessage.split("円");
            //  console.log("[amountArray]", amountArray);
            const amount = amountArray[0];
            //  console.log("[amount]のタイプは？", typeof amount);
            
            var options = {
                          'method': 'POST',
                          'json': 'true',
                          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer',
                          'headers': {
                                     'Accept': 'application/json;charset=UTF-8',
                                     'Content-Type': 'application/json;charset=UTF-8',
                                     'x-access-token': sunabarToken
                           },
                          body: {
                                "depositSpAccountId":kyoyuSpAccountId,
                                "debitSpAccountId":oyaSpAccountId,
                                "currencyCode":"JPY",
                                "paymentAmount":amount
                          }
            };
 
            request(options, function (error, response) {
              if (error) throw new Error(error);
                  console.log(response.body);
                  const data = response.body;
                  console.log("data:", data);
        
                  var options = {
                                'method': 'GET',
                                'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
                                'headers': {
                                           'Accept': 'application/json;charset=UTF-8',
                                           'Content-Type': 'application/json;charset=UTF-8',
                                           'x-access-token': sunabarToken
                                 }
                  };
              request(options, function (error, response) {
                if (error) throw new Error(error);
                    console.log(response.body);
                    const data = JSON.parse(response.body);
                    const balanceOya = parseInt(data.spAccountBalances[0].odBalance, 10); 
                    const balanceKyoyu = parseInt(data.spAccountBalances[2].odBalance, 10);
       
                    resMessage = `振替しました。\n親口座の残高は、${balanceOya.toLocaleString()}円です。\nつかいわけ口座（共有）の残高は、${balanceKyoyu.toLocaleString()}円です。`;

                    return client.replyMessage(
                      replyToken, 
                      {
                      'type': 'text',
                      'text': resMessage
                      });
              });  
           });

        //TODO:残高紹介をした後、〇〇円指定の振り込みができるように実装。
        } else if (reqMessage == '仕送りできる？') {
            var options = {
                          'method': 'GET',
                          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
                          'headers': {
                                     'Accept': 'application/json;charset=UTF-8',
                                     'Content-Type': 'application/json;charset=UTF-8',
                                     'x-access-token': sunabarToken
                          }
            };
           request(options, function (error, response) {
             if (error) throw new Error(error);
                 console.log(response.body);
                 const data =  JSON.parse(response.body);
                 const balanceResponse = parseInt(data.balances[0].balance, 10);
                 console.log("残高 : ",balanceResponse);

             if(balanceResponse < 40000 ) {
                resMessage = `40000円振り込もうとしましたが、残高不足のため振り込めません。残高は、${balanceResponse.toLocaleString()}円です。`;
          
                return client.replyMessage(
                replyToken, 
                {
                'type': 'text',
                'text': resMessage
                });
             } else {
                 var options = {
                               'method': 'POST',
                               'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/request',
                               'headers': {
                                          'Accept': 'application/json;charset=UTF-8',
                                          'Content-Type': 'application/json;charset=UTF-8',
                                          'x-access-token': 'MzAyMTdjYWIwZTMyZDdhY2VjMTY4YzQy'
                               },
                               body: { 
                                     "accountId":"301010005081",
                                     "transferDesignatedDate":dateForApi,
                                     "transferDateHolidayCode":"1",
                                     "totalCount":"1",
                                     "totalAmount":"40000",
                                     "transfers":[		
                                                  {
                                                  "itemId":"1",
                                                  "transferAmount":"40000",
                                                  "beneficiaryBankCode":"0310",
                                                  "beneficiaryBranchCode":"102",
                                                  "accountTypeCode":"1",
                                                  "accountNumber":"0005074",
                                                  "beneficiaryName":"ｽﾅﾊﾞ ｶﾝｼﾞ"	
                                                  },
                                      ],
                                }

                };
                request(options, function (error, response) {
                  if (error) throw new Error(error);
                      console.log(response.body);
                      const data =  JSON.parse(response.body);
                     //振込の受付番号（applyNo)を定数宣言
                     const applyNnmber = data.applyNo;
                     console.log("受付番号: ",applyNnmber);
          
                     resMessage = `受付番号：${applyNnmber}で振込受付完了しました。\nログインしてお知らせからパスワードを入力してください。https://gmo-aozora.com/pfbank/sunabarinfo.html`;

                     return client.replyMessage(
                       replyToken, 
                       {
                       'type': 'text',
                       'text': resMessage
                       });
                 });
              
             }

           });

       } else {
           return client.replyMessage(
             replyToken, 
             {
             'type': 'text',
             'text': '残高？振込？'
             });
       }
   }
};

