function test4() {
  let genre = '幹線';
  let stn = ['福山','新尾道'];
  let job = ['締結'];
  let kywd = '';


console.time('time');
  // sheetデータ
  let sheetID = '1Zzpb-YB-r2yex-XxcHRQVFK-L5SjdD4V6kEC2WwnW_8';
  let st  = SpreadsheetApp.openById(sheetID).getSheetByName(genre);

  let sheet_items = st.getDataRange().getValues();
  Logger.log(sheet_items.length);

  sheet_items = spliceList(sheet_items, 2, stn);

  sheet_items = spliceList(sheet_items, 3, job);

  Logger.log(sheet_items.length);

console.timeEnd('time');
}


function spliceList(masterList, colNum, checkItems){
// masterList(2次元配列) の colNum(int) 列目の要素が checkItems(１次元配列) に含まれている列だけ返す

  // masterLiist => 元リスト
  // colNum　=> 元リストの何列目をチェックするか
  // checkitems => 残したい値のリスト

  if(checkItems[0] != "全部") {
  let num = 0;
  const itemRowNum = masterList.length;
    for(let x = 0; x < itemRowNum; x++) {
      let check = false;
      for(let y = 0; y < checkItems.length; y++){
        let checkItem = masterList[x-num][colNum].split(',');
        for(let i = 0; i < checkItem.length; i++) {
          if(checkItems[y] == checkItem[i]) {
            check = true;
          }
          else if (checkItem[i] == '全部'){
            check = true;
          }
        }
      }
      if(check == false) {
        masterList.splice(x - num,1);
        num++;
      }
    }
  }
  return masterList;
}

function kywd_Filtering(masterList, colNum, kywd){
  return masterList.filter(row => row[colNum].includes(kywd));
}


function kywdtest(){
  let sheetID = '1Zzpb-YB-r2yex-XxcHRQVFK-L5SjdD4V6kEC2WwnW_8';
  let st  = SpreadsheetApp.openById(sheetID).getSheetByName('その他');
  let sheet_items = st.getDataRange().getValues();


  Logger.log(kywd_Filtering(sheet_items,3,'1'));
}



