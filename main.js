import "./assets/scss/all.scss";

import axios from "axios";

let data = [];
// 第一種
// axios
//   .get(
//     "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json"
//   )
//   .then((res) => {
//     res.data.forEach((item) => {
//       data.push(item);
//     });
//     renderData();
//   });

// 第二種
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
  )
  .then((res) => {
    res.data.data.forEach((item) => {
      data.push(item);
    });
    renderData();
  })
  .catch((error) => {
    console.log(error);
  });
function renderData() {
  const areaData = [
    "台北",
    "新北",
    "桃園",
    "臺中",
    "臺南",
    "高雄",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
    "基隆市",
    "新竹市",
    "嘉義市",
  ];

  const list = document.querySelector(".ticketCard-area");
  const regionSearch = document.querySelector(".regionSearch");
  const searchResult = document.querySelector("#searchResult-text");
  // 新增套票變數
  const ticketName = document.querySelector("#ticketName");
  const ticketImgUrl = document.querySelector("#ticketImgUrl");
  const ticketRegion = document.querySelector("#ticketRegion");
  const ticketPrice = document.querySelector("#ticketPrice");
  const ticketNum = document.querySelector("#ticketNum");
  const ticketRate = document.querySelector("#ticketRate");
  const ticketDescription = document.querySelector("#ticketDescription");
  const addBtn = document.querySelector("#addBtn");

  // 放入所有縣市
  function areaOption() {
    let str = `<option value="全部">全部地區</option>`;
    let addStr = `<option value="" disabled selected hidden>請選擇景點地區</option>`;
    areaData.forEach((item) => {
      str += `
      <option value="${item}">${item}</option>`;
      addStr += `
      <option value="${item}">${item}</option>`;
    });
    regionSearch.innerHTML = str;
    ticketRegion.innerHTML = addStr;
  }
  areaOption();
  // 初始化、後續渲染
  function init(data) {
    let str = "";
    data.forEach((item) => {
      str += ` <li class="ticketCard">
      <div class="ticketCard-img">
        <a href="#">
          <img
            src="${item.imgUrl}"
            alt=""
          />
        </a>
        <div class="ticketCard-region">${item.area}</div>
        <div class="ticketCard-rank">${item.rate}</div>
      </div>
      <div class="ticketCard-content">
        <div>
          <h3>
            <a href="#" class="ticketCard-name">${item.name}</a>
          </h3>
          <p class="ticketCard-description">
            ${item.description}
          </p>
        </div>
        <div class="ticketCard-info">
          <p class="ticketCard-num">
            <span><i class="fas fa-exclamation-circle"></i></span>
            剩下最後 <span id="ticketCard-num"> ${item.group}</span> 組
          </p>
          <p class="ticketCard-price">
            TWD <span id="ticketCard-price">${item.price}</span>
          </p>
        </div>
      </div>
    </li>`;
    });
    list.innerHTML = str;
    searchResult.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
  }
  init(data);
  // 呼叫渲染C3
  renderC3(data);
  // 搜尋相對縣市條件
  function filterArea(hostCity) {
    if (hostCity === "全部") {
      return data;
    } else {
      const filterData = data.filter((item) => {
        return item.area === hostCity;
      });
      return filterData;
    }
  }
  //篩選地區監聽功能
  regionSearch.addEventListener("change", (e) => {
    const hostCity = e.target.value;
    init(filterArea(hostCity));
  });

  // 判斷有沒有選項沒填寫或錯誤
  function alertStation(valueArr) {
    let alertState = true;
    valueArr.forEach((item) => {
      alertState = true;
      if (item.value.trim() === "") {
        item.parentElement.nextElementSibling.style.display = "flex";
        alertState = false;
      }
      if (
        item === ticketRate &&
        (Number(item.value.trim()) > 10 || Number(item.value.trim()) < 1)
      ) {
        item.parentElement.nextElementSibling.style.display = "flex";
        alertState = false;
      }

      if (alertState) {
        item.parentElement.nextElementSibling.style.display = "none";
      }
    });
    return alertState;
  }
  //Data 增加物件
  function addObj() {
    const idLength = data.length;
    let obj = {};
    obj.id = idLength;
    obj.name = ticketName.value;
    obj.imgUrl = ticketImgUrl.value;
    obj.area = ticketRegion.value;
    obj.description = ticketDescription.value;
    obj.group = Number(ticketNum.value);
    obj.price = Number(ticketPrice.value);
    obj.rate = Number(ticketRate.value);
    return obj;
  }
  //套票資訊清除
  function cleanData() {
    const ticketForm = document.querySelector(".addTicket-form");
    ticketForm.reset();
  }
  // 增加套票監聽
  addBtn.addEventListener("click", (e) => {
    const valueArr = [
      ticketName,
      ticketImgUrl,
      ticketRegion,
      ticketDescription,
      ticketNum,
      ticketPrice,
      ticketRate,
    ];
    if (!alertStation(valueArr)) return;
    data.push(addObj());
    init(data);
    renderC3(data);
    //將地區搜尋回到預設值
    regionSearch.selectedIndex = 0;
    cleanData();
  });
}
function renderC3(data) {
  let totalAreaData = {};
  data.forEach((item) => {
    if (totalAreaData[item.area] === undefined) {
      totalAreaData[item.area] = 1;
    } else {
      totalAreaData[item.area] += 1;
    }
  });
  let newData = [];
  const areaArr = Object.keys(totalAreaData);
  areaArr.forEach((item) => {
    let newArr = [];
    newArr.push(item);
    newArr.push(totalAreaData[item]);
    newData.push(newArr);
  });

  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type: "donut",
    },
    donut: {
      title: "地區",
      label: {
        show: false, // 控制是否顯示百分比的選項
      },
    },
  });
}
