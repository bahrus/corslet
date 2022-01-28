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
      <title>Corslet Usage</title>

      <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
    </head>
    <body>
      <h1>Corslet Usage</h1>
      <form style="display:flex;flex-direction:column">
        <label for="href">href</label>
        <input type="text" name="href" value="https://www.supremecourt.gov/about/members_text.aspx">
        <label for="lhs">LHS</label>
        <textarea name="lhs"><div id="pagemaindiv" class="col-md-9"></textarea>
        <label for="rhs">RHS</label>
        <textarea name="rhs">script</textarea>
        <label for="exclude_lhs">Exclude LHS</label>
        <input type=checkbox name="exclude_lhs">
        <label for="exclude_rhs">
          Exclude RHS
        </label>
        <input type=checkbox checked name="exclude_rhs">
        <label for="ts">Timestamp</label>
        <input type="text" id="ts" name="ts" value="${new Date().toISOString()}">
        <label for="wrapper">wrapper</label>
        <textarea name="wrapper"><template><header href="[href]">|</header></template></textarea>
        <label for="ua">User-Agent</label>
        <input type="text" name="ua" value="">
        <button type="submit">Submit</button>
      </form>
    </body>
  </html>
  `, {headers});
  }
  const ts = unescape(substrBetween(url, 'ts=', '&')) || new Date().toISOString();
  //TODO:  check for cache
  const ua = unescape(substrBetween(url, 'ua=', '&')) || request.headers.get('user-agent') || "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/96.0.4664.55";
  console.log(ua);
  const response = await fetch(href, {
    headers: {
      "User-Agent": ua,
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",

    }
  });

  const text = await response.text();
  //const between = unescape(substrBetween(url, 'between=', '&')) || '<html></html>';
  const lhs = unescape(substrBetween(url, 'lhs=', '&')).replaceAll('+', ' ') || '<html';
  const rhs = unescape(substrBetween(url, 'rhs=', '&')).replaceAll('+', ' ') || '</html>';
  // const iPosOfClosedAngleBracket = between.indexOf('>');
  // const lhs = unescape(between.substring(0, iPosOfClosedAngleBracket)).replaceAll('+', ' ');
  // const rhs = unescape(between.substring(iPosOfClosedAngleBracket + 1)).replaceAll('+', ' ');
  console.log('lhs', lhs);
  console.log('rhs', rhs);

  const wrapper = (unescape(substrBetween(url, 'wrapper=', '&')) || '').replaceAll('+', ' ').replaceAll('%20', ' ').trim().replace('[href]', href) + '|';
  const splitWrapper = wrapper.split('|');
  const lhsWrapper = splitWrapper[0];
  const rhsWrapper = splitWrapper[1];
  console.log('pos of lhs', text.indexOf(lhs));
  let tween = substrBetween(text, lhs, rhs);
  const exclude_lhs = substrBetween(url, 'exclude_lhs=', '&') === 'true';
  const exclude_rhs = substrBetween(url, 'exclude_rhs=', '&') === 'true';
  console.log('exclude_lhs', exclude_lhs);
  console.log('exclude_rhs', exclude_rhs);
  if(tween === '') {
    tween = '>' + text;
  }
  const respText = `${lhsWrapper}${lhs}${tween}${rhs}${rhsWrapper}`;
  return new Response(respText, {headers});
}
