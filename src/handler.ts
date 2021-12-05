import { substrBetween } from './substrBetween';
import { html } from './html';

const headers =  {
  "content-type": "text/html;charset=UTF-8",
  'Access-Control-Allow-Origin': '*',
};

export async function handleRequest(request: Request): Promise<Response> {
  const url = request.url;
  const href = unescape(substrBetween(url, 'href=', '&'));
  if(href === '') {
    return new Response(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="ts" content="${new Date().toISOString()}">
      <title>PWARP Usage</title>
      <!-- Compiled and minified CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

      <!-- Compiled and minified JavaScript -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </head>
    <body>
      <h1>Corslet Usage</h1>
      <form style="display:flex;flex-direction:column">
        <label for="href">href</label>
        <input type="text" name="href" value="https://www.flipkart.com/">
        <label for="lhs">lhs</label>
        <input type="text" name="lhs" value="<html">
        <label for="rhs">rhs</label>
        <input type="text" name="rhs" value="</html>">
        <label for="ts">Timestamp</label>
        <input type="text" id="ts" name="ts" value="${new Date().toISOString()}">
        <label for="lhsWrapper">lhsWrapper</label>
        <input type="text" name="lhsWrapper" value="">
        <label for="rhsWrapper">rhsWrapper</label>
        <input type="text" name="rhsWrapper" value="">
        <label for="ua">User-Agent</label>
        <input type="text" name="ua" value="">
        <button type="submit">Submit</button>
      </form>
    </body>
  </html>
  `, {headers});
  }
  const ua = unescape(substrBetween(url, 'ua=', '&')) || request.headers.get('user-agent') || "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/96.0.4664.55";
  const response = await fetch(href, {
    headers: {
      "User-Agent": ua,
    }
  });
  const ts = unescape(substrBetween(url, 'ts=', '&')) || new Date().toISOString();
  //TODO:  check for cache
  const text = await response.text();
  const lhs = unescape(substrBetween(url, 'lhs=', '&')) || '<html';
  const rhs = unescape(substrBetween(url, 'rhs=', '&')) || '</html>';
  const lhsWrapper = unescape(substrBetween(url, 'lhsWrapper=', '&')) || '';
  const rhsWrapper = unescape(substrBetween(url, 'rhsWrapper=', '&')) || '';
  const tween = substrBetween(text, lhs, rhs);
  return new Response(`
  <!DOCTYPE html>
  ${lhsWrapper}${lhs}${tween}${rhs}${rhsWrapper}
  `, {headers});
}
