//URLを踏んだ時に実行される
function doGet() {
  let htmlIndex = HtmlService.createTemplateFromFile("index");
  return htmlIndex.evaluate().setTitle("明豊掲示板");
}




function js1(genre, stn, job, kywd){

  console.time('time');


  // sheetデータ
  let sheetID = '1Zzpb-YB-r2yex-XxcHRQVFK-L5SjdD4V6kEC2WwnW_8';
  let st  = SpreadsheetApp.openById(sheetID).getSheetByName(genre);


  // 読み取り配列のCol設定
  let timeStamp_Col = 0;
  let genre_Col = 1;
  let stn_Col = 2;
  let job_Col = 3;
  let naiyou_Col = 4;
  let img_Col = 5;





  // 最終行を読み込みすべて配列に落とす
  let sheet_items = st.getDataRange().getValues();
  Logger.log('genre => ' + sheet_items.length);


  //stn選別
  sheet_items = spliceList(sheet_items, stn_Col, stn);
  Logger.log('stn => ' + sheet_items.length);


  // job選別
  if(genre == '在来' || genre == '幹線'){
    sheet_items = spliceList(sheet_items, job_Col, job);
    Logger.log('job => ' + sheet_items.length);
  }

  // kywdがmasterlistのkywd_Col列に含まれているものだけ残す
  if(kywd != ''){
    masterList = masterList.filter(row => row[naiyou_Col].includes(kywd));
  }
  Logger.log('kywd => ' + sheet_items.length);



  // 新しい投稿が前になるようにソート(古い順に並んでいる前提)
  sheet_items.sort((a, b) => {return b - a;});
  
  let head_mgs_max_length = 20;
  let result = [];
  for (let i = 0; i < sheet_items.length; i++){
    // １件分のお知らせ配列，
    let value = [];

    // 日付のフォーマット
    let daystr = Utilities.formatDate(sheet_items[i][timeStamp_Col], 'JST', 'yyyy/MM/dd');

    // 見出し文章
    let head_mgs = sheet_items[i][naiyou_Col].substr(0, head_mgs_max_length);
    if (head_mgs.length > head_mgs_max_length){
      head_mgs += '...';
    }

    // お知らせ
    value += '<details><summary><b>' + daystr + ' | ' + sheet_items[i][genre_Col] + ' | ' + sheet_items[i][stn_Col] + ' | ' + sheet_items[i][job_Col] + '</b><br>';
    value += '<span class="open">' + head_mgs +'</span></summary>';
    value += '<li>' + sheet_items[i][naiyou_Col] + '</li>';

    // 画像はある時だけ
    let img_list = sheet_items[i][img_Col].split(','); 
    if (img_list != ''){
      for (let j = 0; j < img_list.length; j++){
        value += '<li><img src = \'https://lh3.google.com/u/0/d/' + img_list[j] + '\'></li>';
      }
    }

    // お知らせ終わり
    value += '</details>';

    // 1件分のお知らせ配列を追加
    result.push(value);
  }



  Logger.log(result);
  console.timeEnd('time');
  return result;


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
