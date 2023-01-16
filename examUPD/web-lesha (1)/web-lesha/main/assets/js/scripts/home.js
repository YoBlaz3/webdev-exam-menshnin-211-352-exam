let routesListRef = document.getElementById("routes-list");

const API_BASE_URL = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api';
const API_KEY = '8e9db08d-a24a-4048-86e9-02a58a73cceb';
const API_KEY_PARAMS = `?api_key=${API_KEY}`;
const guidsRowRef = document.getElementById('guids-row');
const guidsTitleRef = document.getElementById('guids-title');
const guidsListRef = document.getElementById('guids-list');
const ChoiceRef = document.getElementById('choice');
const timeRef = document.getElementById('time');
const DateRef = document.getElementById('date');
const CountRef = document.getElementById('count');
const totalSumRef = document.querySelector('#total-sum span');
const optionRef = document.querySelector('#option');
const option2Ref = document.querySelector('#option2');

var currentGuid = null;
const guidsTable = new gridjs.Grid({
  pagination: {
    limit: 5
  },
  sort: !0,
  search: !0,
  data: []
});
guidsTable.render(guidsListRef);
const makeRequestRef = document.getElementById('make-request');
makeRequestRef.style.display = 'none';


var currentRoute = null;





async function getRoutes() {
  let response = await fetch(API_BASE_URL + '/routes' + API_KEY_PARAMS);
  let result = await response.json();
  return result;
}


async function renderRoutes() {
  let routes = await getRoutes();
  const routesTable = new gridjs.Grid({
    columns: [{
      name: "Название"
    }, {
      name: "Описание"
    }, {
      name: "Основные объекты"
    },      
    {   
      name: 'Действие',
      formatter: (cell, row) => {
        return gridjs.h('button', {
          className: 'btn btn-outline-primary waves-effect waves-light',
          onClick: () => {
            currentRoute = routes.find((route) => route.id === cell);
            onRouteChange(cell, row.cells.map((item) => item.data));
          }
        }, 'Выбрать');
      }
    }],
    pagination: {
      limit: 5
    },
    sort: !0,
    search: !0,
    data: routes.map((route) => ([
      route.name,
      route.description,
      route.mainObject,
      route.id
    ]))
  });

  routesTable.render(routesListRef);
}

async function getGuids(routeId) {
  let response = await fetch(API_BASE_URL + `/routes/${routeId}/guides` + API_KEY_PARAMS);
  let result = await response.json();
  return result;
}

function showGuids() {
  guidsRowRef.style.display = 'block';
}

function hideGuids() {
  guidsRowRef.style.display = 'none';
}

function updateGuidTitle(guidName) {
  guidsTitleRef.innerText = `Список гидов по маршруту "${guidName}"`;
}

async function onRouteChange(guidId, guidRow) {
  updateGuidTitle(guidRow[0]);
  await renderGuids();

  currentGuid = null;
  makeRequestRef.style.display = 'none';
}

async function onGuidChange() {
  const modalGuidNameRef = document.querySelector('#modal-guid-name span');
  const modalRouteNameRef = document.querySelector('#modal-route-name span');

  modalGuidNameRef.innerHTML = currentGuid.name;
  modalRouteNameRef.innerHTML = currentRoute.name;

  makeRequestRef.style.display = 'block';
}



document.querySelector("#save").onclick = function(){
  timeOfEx = ChoiceRef.options[ChoiceRef.selectedIndex].value;
  var isItEvening = 0;
  var isItMorning = 0;
  var CodeOfMonth = 0;
  var isThisDayOff = 1
  let str = timeRef.value;
  var number1 = parseInt(str[0] + str[1]);
  var number2 = parseInt(str[3] + str[4]);
  if ((number1 == 9 || number1 ==  10 || number1 == 11) && (number2 <=59)){isItMorning = 400};
  if ((number1 == 20 || number1 == 21 || number1 == 22) && (number2 <=59)){isItEvening = 1000};
  let str2 = DateRef.value;
  var n3 = parseInt(str2[2] + str2[3]);
  var n2 = parseInt(str2[5] + str2[6]);
  var n1 = parseInt(str2[8] + str2[9]);
  let CodeOfYear = ((6+n3+Math.floor(n3/4))%7);
  if (n2 == 1 || n2 == 10){
     CodeOfMonth = 1;
  }
  if (n2 == 5){
     CodeOfMonth = 2;
  }
  if (n2 == 8){
     CodeOfMonth = 3;
  }
  if (n2 == 2 || n2 == 3 || n2 == 11){
     CodeOfMonth = 4;
  }
  if (n2 == 6){
     CodeOfMonth = 5;
  }
  if (n2 == 9 || n2 == 12){
     CodeOfMonth = 6;
  }
  if (n2 == 4 || n2 == 7){
     CodeOfMonth = 2;
  }
  var DayOfTheWeek = ((n1+CodeOfMonth+CodeOfYear)%7);// 0 и 1 - выходные
  if (DayOfTheWeek == 0 || DayOfTheWeek == 1){isThisDayOff = 1.5};
  countOfMembers = parseInt(CountRef.value);
  var price = currentGuid.pricePerHour;
  var totalSumCount = currentGuid.pricePerHour * timeOfEx * isThisDayOff + isItMorning + isItEvening + countOfMembers;
  if (optionRef.checked){totalSumCount = totalSumCount * 1.5};
  totalSumRef.innerHTML = totalSumCount;

  let formData = new FormData();
  formData.append('guide_id', currentGuid.id);
  formData.append('route_id', currentRoute.id);
  formData.append('date', DateRef.value);
  formData.append('time', timeRef.value);
  formData.append('duration', parseInt(ChoiceRef.options[ChoiceRef.selectedIndex].value));
  formData.append('persons', countOfMembers);
  formData.append('price', Math.ceil(totalSumCount));
  formData.append('optionFirst', (optionRef.checked) ? 1 : 0);
  formData.append('optionSecond', (option2Ref.checked) ? 1 : 0);
  fetch(API_BASE_URL + '/orders' + API_KEY_PARAMS, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    referrerPolicy: 'unsafe-url',
    body: formData
  })
  
    .then((response) => response.json())
    
    

}

async function renderGuids() {
  if (currentRoute) {
    showGuids();
    
    let guids = await getGuids(currentRoute.id);

    guidsTable.updateConfig({
      columns: [{
        name: "ФИО"
      }, {
        name: "Языки"
      }, {
        name: "Опыт работы"
      },      
      {   
        name: 'Стоимость услуги (в час)'
      },
      {   
        name: 'Действие',
        formatter: (cell, row) => {
          return gridjs.h('button', {
            className: 'btn btn-outline-primary waves-effect waves-light',
            onClick: () => {
              currentGuid = guids.find((guid) => guid.id === cell);
              onGuidChange(cell);
            }
          }, 'Выбрать');
        }
      }],
      data: guids.map((guid) => ([
        guid.name,
        guid.language,
        `${guid.workExperience} лет`,
        guid.pricePerHour,
        guid.id
      ]))
    }).forceRender();
  }
}

async function updateTableData() {
  renderRoutes();
}


hideGuids();
updateTableData();