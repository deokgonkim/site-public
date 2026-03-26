# CloudFront function

```javascript
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Check whether the URI is missing a file name.
  if (uri.endsWith("/")) {
    request.uri += "index.html";
  } else if (uri.startsWith("/shop/") || uri.startsWith("/guest/")) {
    var r =
      /^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)\/$/;
    var shopOrGuest = request.uri.match(/^(\/shop\/|\/guest\/)/);
    if (uri.match(r)) {
      request.uri = shopOrGuest[0] + "index.html";
      return request;
    }
    return request;
  }
  // Check whether the URI is missing a file extension.
  else if (!uri.includes(".")) {
    // request.uri += '/index.html';
    // 2026-03-26
    // public.dgkim.net에서 quartz 배포시. .html 없는 형태의 URL을 사용하여 추가한다.
    // 그리고 위의 /index.html을 주석처리하였다.
    request.uri += ".html";
  }

  return request;
}
```
