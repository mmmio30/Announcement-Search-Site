//URLを踏んだ時に実行される
function doGet() {
  let htmlIndex = HtmlService.createTemplateFromFile("index");
  return htmlIndex.evaluate().setTitle("明豊掲示板");
}




//スプレッドシートを検索した結果をかえす
   function js1(genre, stn, job, kywd){


  let st =  SpreadsheetApp.openById("1Zzpb-YB-r2yex-XxcHRQVFK-L5SjdD4V6kEC2WwnW_8").getSheetByName("フォームの回答 1");

  // rowNomにすべての行番号を入れる
  let rowNum = []
  var lastRow = st.getRange(st.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();

  for(let n = 1; n < lastRow; n++){
    rowNum.push(n)
  }
  Logger.log('ST全部で' + lastRow + '行');


      //幹在Pでスプレッドシートの読み取り列を変える
    let timeStamp_Col = 1;
    let genre_Col = 2;
    let zairai_stn_Col = 3;
    let zairai_job_Col = 4;
    let kansen_stn_Col = 5;
    let kansen_joc_Col = 6;
    let ponsou_stn_Col = 7;
    let sonota_monpi_Col = 8;
    let naiyou_Col = 9;
    let img_Col = 10;

    let stnCol = 0;
    let jobCol = 0;
    if(genre == '在来'){
      stnCol = zairai_stn_Col;
      jobCol = zairai_job_Col;
    }
    else if(genre == '幹線'){
      stnCol = kansen_stn_Col;
      jobCol = kansen_joc_Col;
    }
    else if(genre == 'ポン清'){
      stnCol = ponsou_stn_Col;
    }
    else if(genre == 'その他'){
      stnCol = sonota_monpi_Col;
    }
    else{
      Logger.log('error')
    }




//ジャンル選別
  //空欄の時エラー
  if(genre == null){
    res = "未選択がありました．";
    return res;
  } 
  else if(genre != "全部") {
    let num = 0;
    const itemRowNum = rowNum.length;
    for(let x = 0; x < itemRowNum; x++) {
      let check = false;
      genreCheck = st.getRange(rowNum[x - num] + 1, 2).getValue().split(", ");
      for(let i = 0; i < genreCheck.length; i++) {
        if(genre == genreCheck[i]) {
          check = true;
        }
      }
      if(check == false) {
        let dlt = rowNum.indexOf(rowNum[x - num]);
        rowNum.splice(dlt,1);
        num++;
      }
    }

  }
Logger.log('genre選別後' +rowNum);

//stn選別

    if(stn[0] == null){
      res = "未選択がありました．";
      return res;
    } 
    else if(stn[0] != "全部") {
      let num = 0;
      const itemRowNum = rowNum.length;
      for(let x = 0; x < itemRowNum; x++) {
        let check = false;
        for(let y = 0; y < stn.length; y++){
          let stnCheck = st.getRange(rowNum[x - num]+1, stnCol).getValue().split(", ");
          for(let i = 0; i < stnCheck.length; i++) {
            if(stn[y] == stnCheck[i]) {
              check = true;
            }
            else if (stnCheck[i] == '全部'){
              check = true;
            }
          }
        }
        if(check == false) {
          let dlt = rowNum.indexOf(rowNum[x - num]);
          rowNum.splice(dlt,1);
          num++;
        }
      }
    }
    Logger.log('stn選別後'+rowNum);


  //job選別
    if(genre != 'ポン清'){
      if(genre != 'その他'){
        if(job == null){
          res = "未選択がありました．";
          return res;
        } 
        else if(job[0] != "全部") {
          let num = 0;
          const itemRowNum = rowNum.length;
          for(let x = 0; x < itemRowNum; x++) {
            let check = false;
            for(let y = 0; y < job.length; y++){
              let jobCheck = st.getRange(rowNum[x - num]+1, jobCol).getValue().split(", ");
              for(let i = 0; i < jobCheck.length; i++) {
                if(job[y] == jobCheck[i]) {
                  check = true;
                }
              }
            }
            if(check == false) {
              let dlt = rowNum.indexOf(rowNum[x - num]);
              rowNum.splice(dlt,1);
              num++;
            }
          }
        }
      }
    }
  
  Logger.log('job選別後'+rowNum);

  if(kywd != "") {
    let kywdFinder = st.getRange("I2:I").createTextFinder(kywd).findAll();
    for(let i in kywdFinder) {
      rowNum.push(kywdFinder[i].getRow()-1);
    }
    rowNum = rowNum.filter(function (x, i, self) {
      return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    });
  }

  rowNum.sort((a, b) => {return b - a;});
  


  Logger.log('kywd選別後'+rowNum);

  //検索後行列からindexに返す配列の作成
  let result = []
  for (let i = 0; i < rowNum.length; i++){
    let day = st.getRange(rowNum[i] +1, timeStamp_Col).getValue();
    let daystr = Utilities.formatDate(day, 'JST', 'yyyy/MM/dd');
    let res_genre = st.getRange(rowNum[i] +1, genre_Col).getValues().join('');
    let res_stn = st.getRange(rowNum[i] +1, stnCol).getValues().join('');
    let res_job = '-';
    if(genre != 'ポン清'){if(genre != 'その他'){
       res_job = st.getRange(rowNum[i] +1, jobCol).getValues().join('');
    }}
    let mgs = st.getRange(rowNum[i] +1, naiyou_Col).getValue();
    let head_mgs = mgs.substr(0, 20);

    if(head_mgs.length > 20){
      head_mgs += '...';
    }





    let res_img = []
    let imgsell = st.getRange(rowNum[i] +1, img_Col).getValue().split(", ");
    if (imgsell != ''){
      for (let j = 0; j < imgsell.length; j++){
        res_img.push('https://lh3.google.com/u/0/d/' + imgsell[j].substr(33));
      }
    }

    result.push([daystr, res_genre, [res_stn], [res_job], head_mgs, mgs, res_img])


  }
  return result;


}
  

