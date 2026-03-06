/*
cors 정책에 안맞는 사이트에 대해서 우회한다.
cors 정책에 안맞는 사이트는 이 함수에 체크해 Porxy 서버가 활성화 되었는지 체크한다.
수동으로 porxy 서버를 생성하지 않고 실행돼 있는지 체크해서 안되어 있음 활성화 시킨다.
나만 보면 돼는데 수동으로 하면 돼지 남들 위해 왜 체크하고 활성화 해 줘야 함?
이 함순 cors가 실행하고 잇는지 아닌지 check한다

<form>
  <p>This demo of CORS Anywhere should only be used for development purposes, see 
     <a href="https://github.com/Rob--W/cors-anywhere/issues/301">https://github.com/Rob--W/cors-anywhere/issues/301</a>.
  <p>To temporarily unlock access to the demo, click on the following button: <input type="submit" value="Request temporary access to the demo server">
  <input type="hidden" name="accessRequest" value="387bf3920583411602f04ef5852f1eb4076119a33f1872426fe1320692c2a9b0">
</form>

https://cors-anywhere.herokuapp.com/corsdemo?accessRequest=387bf3920583411602f04ef5852f1eb4076119a33f1872426fe1320692c2a9b0

*/
async function proxyrun(){
    var url = 'https://cors-anywhere.herokuapp.com/corsdemo?accessRequest=387bf3920583411602f04ef5852f1eb4076119a33f1872426fe1320692c2a9b0';
    var result = '';
    const response = await fetch(url, {
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
          }
    });
    if (!response.ok) {  // 실패
        // response.status http응답코드, response.headers 
        throw new Error(`HTTP error! status: ${response.status}`);  // If not ok (e.g., 404, 500), throw an error to be caught by the catch block
    } else {            // 성공, 200~299이면 true
        const htmlString = await response.text();
        result = `${htmlString}`;
    }
    return `${result}`;
}

/*
cors 정책이 porxy 에도 적용될수 있음. 해서 테스트가 필요함.
cors 가 적용되지 않는데 괜히 그렇필요가 없어 보임. - 가스라이팅 당하지느 말자.
이 함순 cors가 필요한지 안한지 check 한다.
*/ 



/**
https://finance.finup.co.kr/Stock/002960
https://janghunduck.github.io/youngstock/finup_result.html

<div class="box_info mt15">
<div id="divCurrentPrice" class="box_value cm_tit_35 up">
<span id="spCurrentPrice" class="cm_color_bk">508,000</span>
<span class="cm_subtit">
<i class="im im-care-up"></i>
<span id="smPriceChange">
44,000 &#x2B;9.48<i class="p_mark">%</i>
</span>
</span>
</div>

**/

/* ----------------------------------------------------------------------------------------------
  navar finance 에서 현재가격과 등락률을 가져온다. 
  navar는 code에 접근하는 것에 limited 를 설정하고 있으며, cors 정책으로 다이렉트로 접근이 불가능하다.
  우회 프락시서버를 end 단에서 활성화 시켜줘야한다.
  금융위원회의 데이터는 실시간이 아니므로 실시간 데이터는 다른곳에서 가져와야 한다. 
  (잘못하면 해킹에 해당되므로 과도하게 접속을 해서는 안됨)
  (todo) 이런 이유로 막힐경우 finup 등 대안 코딩을 추가한다.
  (todo) url 도 숨기기위해 앞단에서 받아온다. 문제는 여기서 다이렉트로 함수 접근 어렵운것 같음
  code : stock code
  dispalyloc : <div id=displayloc></div>  
------------------------------------------------------------------------------------------------ */
async function crawlcd(code, displayloc) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //cors 우회 프록시 서버 URL
    const url= 'https://finance.naver.com/item/main.naver?code=' + code;
    const decodedUrl = decodeURI( url );
    const response = await fetch(proxyUrl + url, {
        // method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });
    if (!response.ok) {   // 실패 
        // 여기서 부터는 재귀를 사용하고, 파싱에서 뽑을 때는 url를 체크(도메인)해서 처리한다.
        // crawlOther(code, displayloc, url);
        // finup.co.kr에 접속해 가져온다. 우회경로 사용.
        // response.status http응답코드, response.headers 
        // throw new Error(`HTTP error! status: ${response.status}`);  // If not ok (e.g., 404, 500), throw an error to be caught by the catch block
    } else {  // 성공,  200~299이면 true
        const htmlString = await response.text();
        const parser = new DOMParser();
        const htmlDOM = parser.parseFromString(htmlString, 'text/html');
        const items = htmlDOM.querySelectorAll('.blind');
        let  itemslen = items.length;
        var totaltxt = '';
        var result = '';

        for (let i = 0; i < itemslen; i++) {
           totaltxt = totaltxt + items[i].textContent;
           if (items[i].textContent.includes('현재')) {
               var tagdls = items[i].getElementsByTagName('dd');  // HTMLcollector object  vi getElementsByClassName

               for (var j = 0; j < 4; j++) {
                  var ticker = tagdls[j].textContent + '   ';  //getElementById
                  ticker = ticker.replace(/\n/g, ' ');
                  if(tagdls[j].textContent .includes('종목')){ } else {
                      result = result + '\n' + ticker;
                  }
               }
           }
        }

        result = result.replaceAll('현재가','');
        result = result.replaceAll('전일대비',' ');
        result = result.replaceAll('하락','▼');
        result = result.replaceAll('상승','▲');
        result = result.replaceAll('보합',', ');
        result = result.replaceAll('마이너스',', -');
        result = result.replaceAll('플러스',', +');
        result = result.replaceAll('퍼센트','%');
    
        document.getElementById(displayloc).innerText = `${result}`; 
    }
}

function _gethostname(urlString){
  const url = new URL(urlString);
  return url.hostname; // "www.example.com" (도메인만)  
}

/* ----------------------------------------------------------------------------------------------
crawlcd 에서 응답이 없는 경우 crawlcd 함수 안에서 호출된다.
crawlcd 함수와 동일하나 urlSting(https://....)를 인자로 받는다.
이 함수는 재귀함수로 다시 응답이 없으면 다른 url로 재 호출하고 url의 hostname를 구분자로 파싱을 수행한다. 
------------------------------------------------------------------------------------------------ */
async function crawlOther(code, displayloc, urlString) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //cors 우회 프록시 서버 URL
    const url= urlString + code;
    const decodedUrl = decodeURI( url );
    const response = await fetch(proxyUrl + url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });
    if (!response.ok) {
        // 여기서 부터는 재귀를 사용하고, 파싱에서 뽑을 때는 url를 체크(도메인)해서 처리한다.
        // crawlOther(code, displayloc, url);
        // finup.co.kr에 접속해 가져온다. 우회경로 사용.
        // throw new Error(`HTTP error! status: ${response.status}`);  // If not ok (e.g., 404, 500), throw an error to be caught by the catch block
    } else {
        const htmlString = await response.text();
        const parser = new DOMParser();
        const htmlDOM = parser.parseFromString(htmlString, 'text/html');
        const items = htmlDOM.querySelectorAll('.blind');
        let  itemslen = items.length;
        var totaltxt = '';
        var result = '';

        for (let i = 0; i < itemslen; i++) {
           totaltxt = totaltxt + items[i].textContent;
           if (items[i].textContent.includes('현재')) {
               var tagdls = items[i].getElementsByTagName('dd');  // HTMLcollector object  vi getElementsByClassName

               for (var j = 0; j < 4; j++) {
                  var ticker = tagdls[j].textContent + '   ';  //getElementById
                  ticker = ticker.replace(/\n/g, ' ');
                  if(tagdls[j].textContent .includes('종목')){ } else {
                      result = result + '\n' + ticker;
                  }
               }
           }
        }

        result = result.replaceAll('현재가','');
        result = result.replaceAll('전일대비',' ');
        result = result.replaceAll('하락','▼');
        result = result.replaceAll('상승','▲');
        result = result.replaceAll('보합',', ');
        result = result.replaceAll('마이너스',', -');
        result = result.replaceAll('플러스',', +');
        result = result.replaceAll('퍼센트','%');
    
        document.getElementById(displayloc).innerText = `${result}`; 
    }
}

/* ------------------------------------------------------------------------------------------------------------
 data.go.kr(금융위원회(fsc)_주식시세정보) api를 얻어오기
 https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=인증키&numOfRows=1&pageNo=1
 인증키의 경우 앞단(티스토리)에서 넘겨 받아야 함, 티스토리는 마우스 우클릭을 못하게 되어 있으므로 소스를 보지 못한다.
 금융위원회에서 제공하는 모든 서비스는 실시간이 아니며, 데이터 갱신은 기준일자로부터 영업일 하루 뒤 오후 1시 이후에 업데이트됩니다.
 todo: url 자체도 숨기기위해 앞단에서 받아온다. cors 해당사항 없음
--------------------------------------------------------------------------------------------------------------- */
async function getFscData(authkey, code, displayloc){

    var container = document.getElementById(displayloc);
    const params = new URLSearchParams({
        serviceKey: authkey, // 인증키
        numOfRows: "1",
        pageNo: "1",
        resultType: "json",   // 리턴 xml json
        beginBasDt: "",       // 기준일자가 검색값보다 크거나 같은 데이터를 검색, 날짜데이터를 계산해야함, 기본 최신 날짜의 정보를 가져옴(default)
        likeSrtnCd: code,     // 주식코드 003690 (코리안리)
        isinCd: ""            //  ISN 코드
    });
    let key = params.get('serviceKey');
    let resultType = params.get('resultType');
    if (key) {
      params.set('serviceKey', key.replace(/\n/g,''));  // \n을 제거하고 다시 설정
    }
    const url = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?' + params.toString();
    container.innerText = `${url}`; 
    try {
      const response = await fetch(url, {
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
          }
      });

      if (!response.ok) {
        alert(`response not ok! ${url} \n`);
        throw new Error(`HTTP error! status: ${response.status}`);  // If not ok (e.g., 404, 500), throw an error to be caught by the catch block
      }
      
      const resultString = await response.text();  // html형태로 받음, response.json();으로도 가능
      var items = {};
      var item = [];
      if (resultType == 'json'){
        const obj = JSON.parse(resultString);
        items = obj.response.body.items;   // { {[]}, {[]}, ...} 
        for (var i=0; i < items.length-1; i++){
           //items[i];
        }
                                              //  "item":[ { "basDt":"20260226", "srtnCd":"002960", ... } ] 배열안에 하나의 object
        
        //for ( var i = 0; i < arr.length; i++ ){
        //  node = arr[i];
        //}
        // arr[0].basDt   // 20260226
        // arr[0].srtnCd  // 002960
        // arr[0].isinCd
        // arr[0].itmsNm
        // arr[0].mrktCtg
        // arr[0].clpr
        // arr[0].vs
        // arr[0].fltR
        
      } else if (resultType == 'xml'){
      
      }
    
      //const parser = new DOMParser();
      //const htmlDOM = parser.parseFromString(htmlString, 'text/html');

      //const items = htmlDOM.querySelectorAll('.blind');
      //let  itemslen = items.length;
      container.innerHTML += `last result : ${url} \n ${resultString}`; 
    } catch(err) {
      alert("Could not fetch data:" + error.message);
    }
}



/* ------------------------------------------------------------------------------------
  0. 공공테이터 포탈 서비스키 가져오기 
  1. cors 로 우회 프락시 서버를 활성화 해야한다.
  2. 공공데이터포탈의 할당된 serviceKey에 대해서 특정 사이트에 저장하고 가져온다.
     여기서 특정사이트에 대해 서버런 해서 관리하면 좋지만, 말단 입장에서 어디 둘때도 없으니 부득이하게 안전한 곳에 두고 사용하자!
     참 고민이지만, 보안이 튼튼한 곳에 빌붓으려니 한 단계 접고 가야하고 어떻게든 숨기긴 해야 하고.
     부득이하게 하드코딩을 피하기위해 외부에서 가져오는 방식을 취한다.
  3. 외에 2차 보안은 serviceKey 를 자주 바꾸는 것으로 ...
  4. todo: 암호화 처리를 추가하는 걸로 ... 
  5. todo: 프록시 우회 삭제요청, 테스트 요청
--------------------------------------------------------------------------------------- */
async function getServiceKey(){
    var log = '';
    const url= 'https://youngsto.tistory.com/58';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //cors 우회 프록시 서버 URL
    const decodedUrl = decodeURI( url );
    log += `${proxyUrl}${url}`;
    log += `${proxyUrl}${decodedUrl}`;
    document.getElementById('console_resulta').innerText = `${log}`; 
    const response = await fetch(proxyUrl + url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });

    const htmlString = await response.text();
    log += `${htmlString}`;
    document.getElementById('console_resulta').innerText = `${log}`; 
  
    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(htmlString, 'text/html');
    const items = htmlDOM.querySelectorAll('tbody');
    let itemslen = items.length;
    let result;
    for (let i = 0; i < itemslen; i++) {
       result = items[i].textContent;
    }
    return `${result}`;
}


async function crawl(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';   //cors 우회 프록시 서버 URL
    const decodedUrl = decodeURI(url);
    const response = await fetch(proxyUrl + url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });

    const htmlString = await response.text();
    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(htmlString, 'text/html');

    const items = htmlDOM.querySelectorAll('.blind');
    let  itemslen = items.length;
    var totaltxt = '';
    var result = '';

    for (let i = 0; i < itemslen; i++) {
       totaltxt = totaltxt + items[i].textContent;
       if (items[i].textContent.includes('현재')) {
             //alert(items[i].textContent);
             var tagdls = items[i].getElementsByTagName('dd');  // HTMLcollector object  vi getElementsByClassName
             //alert(tagdls.length);
             //for (var j = 0; j < tagdls.length; j++) {
             for (var j = 0; j < 4; j++) {
                var ticker = tagdls[j].textContent + '   ';  //getElementById
                ticker = ticker.replace(/\n/g, ' ');
                if(tagdls[j].textContent .includes('종목')){ } else {
                    //alert(ticker);
                    result = result + '\n' + ticker;
                }
             }
         }
    }
    //result = result.replaceAll('장마감','');
    result = result.replaceAll('현재가','');
    result = result.replaceAll('전일대비',' ');
    result = result.replaceAll('하락','▼');
    result = result.replaceAll('상승','▲');
    result = result.replaceAll('마이너스','-');
    result = result.replaceAll('플러스','+');
    result = result.replaceAll('퍼센트','%');
    document.getElementById('console_result').innerText = `${result}`; 
    //document.getElementById('console-output').innerText = `${totaltxt}`; 
}



async function crawlc(code) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //cors 우회 프록시 서버 URL
    const url= 'https://finance.naver.com/item/main.naver?code=' + code;
    const decodedUrl = decodeURI( url );
    const response = await fetch(proxyUrl + url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });

    const htmlString = await response.text();
    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(htmlString, 'text/html');

    const items = htmlDOM.querySelectorAll('.blind');
    let  itemslen = items.length;
    var totaltxt = '';
    var result = '';

    for (let i = 0; i < itemslen; i++) {
       totaltxt = totaltxt + items[i].textContent;
       if (items[i].textContent.includes('현재')) {
             //alert(items[i].textContent);
             var tagdls = items[i].getElementsByTagName('dd');  // HTMLcollector object  vi getElementsByClassName
             //alert(tagdls.length);
             //for (var j = 0; j < tagdls.length; j++) {
             for (var j = 0; j < 4; j++) {
                var ticker = tagdls[j].textContent + '   ';  //getElementById
                ticker = ticker.replace(/\n/g, ' ');
                if(tagdls[j].textContent .includes('종목')){ } else {
                    //alert(ticker);
                    result = result + '\n' + ticker;
                }
             }
         }
    }
    //result = result.replaceAll('장마감','');
    result = result.replaceAll('현재가','');
    result = result.replaceAll('전일대비',' ');
    result = result.replaceAll('하락','▼');
    result = result.replaceAll('상승','▲');
    result = result.replaceAll('마이너스','-');
    result = result.replaceAll('플러스','+');
    result = result.replaceAll('퍼센트','%');
    document.getElementById('console_resultc').innerText = `${result}`; 
    //document.getElementById('console-output').innerText = `${totaltxt}`; 
}



async function crawlhtml(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';   //cors 우회 프록시 서버 URL
    const decodedUrl = decodeURI(url);
    const response = await fetch(proxyUrl + url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });

    const htmlString = await response.text();
    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(htmlString, 'text/html');

    document.getElementById('console_result').innerText = `${htmlString}`; 
}

// 코인
async function getBtcPrice() {
  fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC')
    .then(response => response.json())
    .then(data => {
      const price = data[0].trade_price;
      console.log(`현재 비트코인 가격: ${price.toLocaleString()} KRW`);
        document.getElementById('console_result').innerText = `${price.toLocaleString()} KRW`; 
      // 여기에 화면에 가격을 표시하는 로직 추가
    })
    .catch(error => console.error('에러 발생:', error));
}


// 코인
async function getCoinPrice(code, displayloc) {
        const websocket = new WebSocket('wss://pubwss.bithumb.com/pub/ws');

        websocket.onopen = () => {
            console.log('WebSocket connected');
            websocket.send(JSON.stringify({
                type: 'ticker',
                symbols: [code],
                tickTypes: ['1H']
            }));
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.hasOwnProperty('content') && data.content.tickType === '1H') {
                const btcPrice = data.content.closePrice;
                document.getElementById(displayloc).textContent = btcPrice.toLocaleString() + ' KRW';
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

}
































































































































