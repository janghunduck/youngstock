
# usage 1 - return current stock price 

```html
<div id="console_resulta">&nbsp;</div>
<script src="https://janghunduck.github.io/youngstock/youngstock.js"></script>
<script>crawlcd('317450', 'console_resulta');</script>
```


# usage 2 - return html in page

```html
<div id="console_result">&nbsp;</div>
<script src="https://janghunduck.github.io/youngstock/youngstock.js"></script>
<script>crawl(url);</script>
```

https://janghunduck.github.io/youngstock/test/google.html </br>
https://janghunduck.github.io/youngstock/test/naver.html  </br>

# usage 3 - return bitcoin

```
<div id="console_result">&nbsp;</div>
<script src="https://janghunduck.github.io/youngstock/youngstock.js"></script>
<script>
setInterval(getBtcPrice, 2000);  // refresh interval 2 sec
getBtcPrice(); 
</script>
```

https://janghunduck.github.io/youngstock/test/upbit.html  </br>

