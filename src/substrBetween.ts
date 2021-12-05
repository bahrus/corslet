export function substrBetween(str: string, start: string, end: string): string {
  const start_pos = str.indexOf(start);
  if(start_pos === -1) return '';
  const iPos = str.indexOf(end, start_pos + start.length);
  return iPos === -1 ? str.substring(start_pos + start.length) :  str.substring(start_pos + start.length, iPos);
}

export function splitBetween(str: string, start: string, end: string): string[]{
  const returnArr: string[] = [];
  let remainingStr = str;
  let start_pos = remainingStr.indexOf(start);
  let end_pos = remainingStr.indexOf(end, start_pos + start.length);
  if(start_pos === -1 || end_pos === -1) return returnArr;
  while(start_pos !== -1 && end_pos !== -1){
    returnArr.push(remainingStr.substring(start_pos + start.length, end_pos));
    remainingStr = remainingStr.substring(end_pos + end.length);
    start_pos = remainingStr.indexOf(start);
    end_pos = remainingStr.indexOf(end, start_pos + start.length);
  }
  return returnArr;
}