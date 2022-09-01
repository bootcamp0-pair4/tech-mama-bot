'use strict';
//モジュールのインポート
const line = require('@line/bot-sdk');//LINEのMessaging APIのクライアントライブラリ
var request = require('request');//Node.jsのrequestモジュール

//パラメーター設定
const config = {
       channelSecret: process.env.channelSecretLINE,
       channelAccessToken: process.env.channelAccessTokenLINE
    };
    
    const client = new line.Client(config);//クライアントとしてラインを定義
    const sunabarToken = process.env.sunabarToken;
    const sunabarTokenChild = process.env.sunabarTokenChild;

    
// Webhookは、イベント発生をトリガにして送信側がデータを送出する  
exports.handler = (event) => {
    
    if (typeof event === "object") {
        
        console.log("イベントのタイプは？", typeof event);//object
        console.log("EventBrisge : ",event.resources[0]);
    
        let remaind =event.resources[0];//エラー
        console.log("remaind : ",remaind);
    
        console.log("process.env.remindToken: ", process.env.remindToken);
        console.log("process.env.remindToken2: ", process.env.remindToken2);
        console.log("process.env.remindToken3: ", process.env.remindToken3);
     
        //remind1:体温チェック
        if (remaind == process.env.remindToken) {
            return client.pushMessage(process.env.USER_ID, 
        
             {
              'type': 'text',
              'text': '体温チェックしましたか？'
             });
        
        //remind2：水やり
        } else if (remaind == process.env.remindToken2) {
            return client.pushMessage(process.env.USER_ID, 
        
              {
              'type': 'text',
              'text': '水やりしましたか？'
              }); 
        
        //remind3：食洗機
        } else if (remaind == process.env.remindToken3) {
            return client.pushMessage(process.env.USER_ID, 
        
              {
              'type': 'text',
              'text': '食洗機のスイッチ入れましたか？'
              });
        };
  } else if ( typeof event !== "object") {
       console.log("イベントのタイプは？", typeof event);
       //これまでのコードをはる
       const replyToken = JSON.parse(event.body).events[0].replyToken;
    
    let reqMessage = JSON.parse(event.body).events[0].message.text;
    let resMessage = "";
    
    // 現在の時間（日本）2022-09-01の表示の仕方で取得する => 振込APIに必要
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var monthTwoDigits = month.toString().padStart(2, "0");
    var dayTwoDigits = day.toString().padStart(2, "0");
    const dateForApi = year + '-' + monthTwoDigits + '-' + dayTwoDigits
    // console.log(dateForApi);//2202-09-01 ok
    // console.log("タイプは? : ",typeof dateForApi);//string
    
    if (reqMessage == 'おはよう') {
        resMessage = 'ゆっくり寝れました？';
        console.log('LINEに応答');
        return client.replyMessage(
        replyToken, 
        {
            'type': 'text',
            'text': resMessage
        });
        
    } else if (reqMessage == '教えて') {

        resMessage = 'お疲れ、よくがんばったね！よしよし！';

        return client.replyMessage(
        replyToken, 
        {
            'type': 'text',
            'text': resMessage
        });

    } else if (reqMessage == '残高') {
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
        //   console.log(response.body);
        //   const data =  JSON.parse(response.body);
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
         try{
            if (error) {
              throw new Error('テックまが、あなたを認可していない可能性があります。');
            }
         } catch (e) {
               console.error( "エラー：", e.message );
               resMessage = e.message;

               return client.replyMessage(
                 replyToken, 
                 {
                 'type': 'text',
                 'text': resMessage
                 });
         }  
          
        //   console.log(response.body);
        //   const data =  JSON.parse(response.body);
          const data = response.body;
          //テックまの口座残高の数値化
          const balanceResponse = parseInt(data.balances[0].balance, 10);
          console.log("テックまの残高 : ",balanceResponse);
     
          resMessage = `テックまの残高は${balanceResponse.toLocaleString()}円です。`;

          return client.replyMessage(
            replyToken, 
            {
            'type': 'text',
            'text': resMessage
            });
     
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
    //   let transferAmountArray = reqMessage.split('円');
    //   console.log("transferAmountArray : ", transferAmountArray);
    //   const transferAmount = parseInt(transferAmountArray[0]);
       
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
         console.log("response.body : ", response.body);//エラー：
         console.log("applyNo : ",response.body.applyNo);
         //振込の受付番号（applyNo)を定数宣言
         
         console.log("受付番号: ",response.body.applyNo);
          
         resMessage = `受付番号：${response.body.applyNo}でおこづかい${transferAmountArray[0].toLocaleString()}円振込受付完了しました。ログインしてお知らせからパスワードを入力してください。https://gmo-aozora.com/pfbank/sunabarinfo.html`;

         return client.replyMessage(
           replyToken, 
           {
            'type': 'text',
            'text': resMessage
           });
       });


    }  else if (reqMessage ==='振替') {
    
         var options = {
                       'method': 'POST',
                       'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer',
                       'headers': {
                                  'Accept': 'application/json;charset=UTF-8',
                                  'Content-Type': 'application/json;charset=UTF-8',
                                  'x-access-token': sunabarToken
                                  },
                       body: '{ \r\n	"depositSpAccountId":"SP50220278942",\r\n	"debitSpAccountId":"SP30110005081",\r\n	"currencyCode":"JPY",\r\n	"paymentAmount":"1000"\r\n}'

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
                                    'x-access-token': 'MzAyMTdjYWIwZTMyZDdhY2VjMTY4YzQy'
                         }
          };
          request(options, function (error, response) {
          if (error) throw new Error(error);
          console.log(response.body);
          
          const data = JSON.parse(response.body);
          const balance1 = parseInt(data.spAccountBalances[0].odBalance, 10); 
          const balance2 = parseInt(data.spAccountBalances[1].odBalance, 10);
          
           resMessage = `振替しました。親口座の残高は、${balance1.toLocaleString()}円です。子口座（保育料）の残高は、${balance2.toLocaleString()}円です。`;

           return client.replyMessage(
             replyToken, 
             {
            'type': 'text',
            'text': resMessage
        });
          });
  
  
});

    } else if (reqMessage == '振り込みできる？') {
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
                            body: '{ \n	"accountId":"301010005081",\n	"transferDesignatedDate":"2022-08-31", \n	"transferDateHolidayCode":"1", \n	"totalCount":"1", \n	"totalAmount":"40000", \n	"transfers":\n	[\n		{ \n			"itemId":"1", \n			"transferAmount":"40000", \n			"beneficiaryBankCode":"0310",\n			"beneficiaryBranchCode":"102", \n			"accountTypeCode":"1", \n			"accountNumber":"0005074", \n			"beneficiaryName":"ｽﾅﾊﾞ ｶﾝｼﾞ"\n		}\n	] \n}'

             };
             request(options, function (error, response) {
               if (error) throw new Error(error);
               console.log(response.body);
  
               const data =  JSON.parse(response.body);
               //振込の受付番号（applyNo)を定数宣言
               const applyNnmber = data.applyNo;
               console.log("受付番号: ",applyNnmber);
          
               resMessage = `受付番号：${applyNnmber}で振込受付完了しました。ログインしてお知らせからパスワードを入力してください。https://gmo-aozora.com/pfbank/sunabarinfo.html`;

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

