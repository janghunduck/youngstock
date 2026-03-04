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
    if (!response.ok) {   // 200~299이면 true, response.status http응답코드, response.headers 
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

function _gethostname(urlString){
  const url = new URL(urlString);
  return url.hostname; // "www.example.com" (도메인만)  
}

/* ----------------------------------------------------------------------------------------------
crawlcd 에서 응답이 없는 경우 crawlcd 함수 안에서 호출된다.
crawlcd 함수와 동일하나 urlSting를 인자로 받는다.
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
 todo: url 자체도 숨기기위해 앞단에서 받아온다. cors 정책으로 js안에서 접속이 않될 수 있다.
--------------------------------------------------------------------------------------------------------------- */
async function getFscData(authkey, code, displayloc){

    const container = document.getElementById(displayloc);
    const result = '';
    const params = new URLSearchParams({
        serviceKey: authkey, // 인증키
        numOfRows: "1",
        pageNo: "1",
        resultType: "json",   // 리턴 xml json
        beginBasDt: "",       // 기준일자가 검색값보다 크거나 같은 데이터를 검색, 날짜데이터를 계산해야함
        likeSrtnCd: code,     // 주식코드 003690 (코리안리)
        isinCd: ""            //  ISN 코드
    });
    let key = params.get('serviceKey');
    let resultType = params.get('resultType');
    if (key) {
      params.set('serviceKey', key.replace(/\n/g,''));  // \n을 제거하고 다시 설정
    }
    const url = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?' + params.toString();

    try {
      const response = await fetch(url, {
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
          }
      });

      if (!response.ok) {
        result += `<p>response not ok! </br> ${url}</p>`;
        throw new Error(`HTTP error! status: ${response.status}`);  // If not ok (e.g., 404, 500), throw an error to be caught by the catch block
      }
      
      const resultString = await response.text();  // html형태로 받음, response.json();으로도 가능
      if (resultType == 'json'){
        const obj = JSON.parse(resultString);
        //obj.response.body.items.item;
      
      } else if (resultType == 'xml'){
      
      }
    
      //const parser = new DOMParser();
      //const htmlDOM = parser.parseFromString(htmlString, 'text/html');

      //const items = htmlDOM.querySelectorAll('.blind');
      //let  itemslen = items.length;
      result += `<p>last result : </br>${url} </br> json=>${resultString} </p>`; 
      container.innerHTML += `${result}`; 
    } catch(err) {
      alert("Could not fetch data:" + error.message);
    }
}



/* ------------------------------------------------------------------------------------
  1. cors 로 우회 프락시 서버를 활성화 해야한다.
  2. 공공데이터포탈의 할당된 serviceKey에 대해서 특정 사이트에 저장하고 가져온다.
     부득이하게 하드코딩을 피하기위해 외부에서 가져오는 방식을 취한다.
  3. 외에 2차 보안은 serviceKey 를 자주 바꾸는 것으로 ...
  4. todo: 암호화 처리를 추가하는 걸로 ... 
--------------------------------------------------------------------------------------- */
async function getServiceKey(){
    const url= 'https://youngsto.tistory.com/58';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //cors 우회 프록시 서버 URL
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





































































































