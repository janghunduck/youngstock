

// <div id=displayloc></div>  
// 실제 사용 코드
async function crawlcd(code, displayloc) {
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
    result = result.replaceAll('보합',', ');
    result = result.replaceAll('마이너스',', -');
    result = result.replaceAll('플러스',', +');
    result = result.replaceAll('퍼센트','%');

    document.getElementById(displayloc).innerText = `${result}`; // div id에 넣어준다.
    //document.getElementById('console-output').innerText = `${totaltxt}`; 
}

﻿


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








