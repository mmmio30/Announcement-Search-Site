// ジャンルで分けたシートから選別

function test(){

  console.time('time');

  let genre = 'その他';
  let stn = ['福山'];
  let job = [];
  let kywd = '';

  // sheetデータ
  let sheetID = '1Zzpb-YB-r2yex-XxcHRQVFK-L5SjdD4V6kEC2WwnW_8';
  let ss  = SpreadsheetApp.openById(sheetID);


  //幹在Pでスプレッドシートの読み取り列を変える
  let timeStamp_Col = 1;
  let genre_Col = 2;
  let stnCol = 0;
  let jobCol = 0;
  let naiyou_Col = 0;
  let img_Col = 0;

  if(genre == '在来'){
    stnCol = 3;
    jobCol = 4;
    naiyou_Col = 5;
    img_Col = 6;
  }
  else if(genre == '幹線'){
    stnCol = 3;
    jobCol = 4;
    naiyou_Col = 5;
    img_Col = 6;
  }
  else if(genre == 'ポン清'){
    stnCol = 3;
    naiyou_Col = 4;
    img_Col = 5;
  }
  else if(genre == 'その他'){
    stnCol = 3;
    naiyou_Col = 4;
    img_Col = 5;
  }
  else{
    Logger.log('error')
  }
  let st = ss.getSheetByName(genre);

  // rowNomにすべての行番号を入れる
  let rowNum = []
  var lastRow = st.getLastRow();

  for(let n = 1; n < lastRow; n++){
    rowNum.push(n)
  }
  Logger.log('genre選別後' + lastRow + '行');




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

    result.push([daystr, res_genre, [res_stn], [res_job], head_mgs, mgs, res_img]);


  }

  Logger.log(result.length);
  console.timeEnd('time');
  return result;


}
