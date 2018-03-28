# http-request
Simple wrapper module for making http requests on the client.

<pre>
import HttpRequest from 'http-request';
...
let request = new HttpRequest([url], [eagerness], [useCredentials], [username], [password]);

request.then(function(response) {
  console.log(response);
}).catch(function(response) {
  console.error(response);
});;
</pre>
