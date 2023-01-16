
const optionModalRef = document.querySelector('#exampleModal');
const modalGuidNameRef = document.querySelector('#modal-guid-name span');
const modalRouteNameRef = document.querySelector('#modal-route-name span');
const modalGuidNameRef2 = document.querySelector('#modal-guid-name2 span');
const modalRouteNameRef2 = document.querySelector('#modal-route-name2 span');
const ChoiceRef = document.getElementById('choice');
const timeRef = document.getElementById('time');
const DateRef = document.getElementById('date');
const CountRef = document.getElementById('count');
const ChoiceRef2 = document.querySelector('#choice2 span');
const timeRef2 = document.querySelector('#time2 span');
const DateRef2 = document.querySelector('#date2 span');
const CountRef2 = document.querySelector('#count2 span');
const totalSumRef = document.querySelector('#total-sum span');
const totalSumRef2 = document.querySelector('#total-sum2 span');
const optionRef = document.querySelector('#option');
const option2Ref = document.querySelector('#option2');
const option = document.querySelector('#option3 span');
const option2 = document.querySelector('#option4 span');
function refresh(){
  location.reload();
} 

const API_BASE_URL = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api';
const API_KEY = '8e9db08d-a24a-4048-86e9-02a58a73cceb';
const API_KEY_PARAMS = `?api_key=${API_KEY}`;
let orderListRef = document.getElementById("orders-list");

document.getElementById('make-request').style.visibility = 'hidden';
const btn = document.getElementById('make-request');
document.getElementById('checkorder').style.visibility = 'hidden';
const btn2 = document.getElementById('checkorder');
document.getElementById('del').style.visibility = 'hidden';
const btn3 = document.getElementById('del');


async function getOrders() {
  let response = await fetch(API_BASE_URL + '/orders' + API_KEY_PARAMS);
  let result = await response.json();
  return result;
}

async function getRoutes() {
  let response = await fetch(API_BASE_URL + '/routes' + API_KEY_PARAMS);
  let result = await response.json();
  return result;
}

async function getGuids(routeId) {
  let response = await fetch(API_BASE_URL + `/routes/${routeId}/guides` + API_KEY_PARAMS);
  let result = await response.json();
  return result;
}


async function renderOrders() {
    let orders = await getOrders();

    let routes = await getRoutes();
    let serializedOrders = await Promise.all(orders.map(async (order) => {
      let route = routes.find((route) => route.id === order.route_id);
      let guids = await getGuids(order.route_id);
      let guid = guids.find((guid) => guid.id === order.guide_id);
      order.route = route;
      order.guid = guid;
      return order;
    }))
    console.log(serializedOrders);
    console.log(serializedOrders);
    const ordersTable = new gridjs.Grid({
      columns: [{
        name: "ID"
      }, {
        name: "Имя гида"
      }, {
        name: "Название маршрута"
      },  
      {   
        name: 'Стоимость',
      },    
      {   
        name: 'Дата',
      },
      {   
        name: 'Люди',
        hidden: true
      },
      {   
        name: 'Удалить',
        formatter: (cell, row) => {
          return gridjs.h('button', {
            className: 'btn btn-outline-primary waves-effect waves-light',
            onClick: () => {
              btn3.click();
              document.querySelector("#sss").onclick = function(){
                let CurrentOrderId = row.cells.map((item) => item.data)[0];
                fetch(API_BASE_URL + `/orders/${CurrentOrderId}` + API_KEY_PARAMS, {
                  method: 'DELETE',
                })
                setTimeout(refresh, 1000);
              }
            }
            
          }, 'Удалить');
        }
      },
      {   
        name: 'Изменить',
        formatter: (cell, row) => {
          return gridjs.h('button', {
            className: 'btn btn-outline-primary waves-effect waves-light',
            onClick: () => {
              modalGuidNameRef.innerHTML = row.cells.map((item) => item.data)[1];
              modalRouteNameRef.innerHTML = row.cells.map((item) => item.data)[2];
              btn.click();
              document.querySelector("#save").onclick = function(){
                let CurrentOrderId = row.cells.map((item) => item.data)[0];
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
                var totalSumCount =row.cells.map((item) => item.data)[3] ;
                if (optionRef.checked){totalSumCount = totalSumCount * 1.5};
                totalSumRef.innerHTML = totalSumCount;
                let formData = new FormData();
                console.log(row.cells.map((item) => item.data));
                formData.append('guide_id', row.cells.map((item) => item.data)[6]);
                formData.append('route_id', row.cells.map((item) => item.data)[7]);
                formData.append('date', DateRef.value);
                formData.append('time', timeRef.value);
                formData.append('duration', parseInt(ChoiceRef.options[ChoiceRef.selectedIndex].value));
                formData.append('persons', countOfMembers);
                formData.append('price', Math.ceil(totalSumCount));
                formData.append('optionFirst', (optionRef.checked) ? 1 : 0);
                formData.append('optionSecond', (option2Ref.checked) ? 1 : 0);
                fetch(API_BASE_URL + `/orders/${CurrentOrderId}` + API_KEY_PARAMS, {
                  method: 'PUT',
                  body: formData,
                })
                setTimeout(refresh, 1000);
              }
            }
            
          }, 'Изменить');
        }
      },
      {   
        name: 'Просмотреть заявку',
        formatter: (cell, row) => {
          return gridjs.h('button', {
            className: 'btn btn-outline-primary waves-effect waves-light',
            onClick: () => {
              btn2.click();
              modalGuidNameRef2.innerHTML = row.cells.map((item) => item.data)[1];
              modalRouteNameRef2.innerHTML = row.cells.map((item) => item.data)[2];
              DateRef2.innerHTML = row.cells.map((item) => item.data)[4];
              timeRef2.innerHTML = row.cells.map((item) => item.data)[8];
              ChoiceRef2.innerHTML = row.cells.map((item) => item.data)[9];
              CountRef2.innerHTML = row.cells.map((item) => item.data)[5];
              totalSumRef2.innerHTML = row.cells.map((item) => item.data)[3];
              if (row.cells.map((item) => item.data)[10] == false){
                option.innerHTML = 'Не выбрано';
              }
              if (row.cells.map((item) => item.data)[10] == true){
                option.innerHTML = 'Выбрано';
              }
              if (row.cells.map((item) => item.data)[11] == false){
                option2.innerHTML = 'Не выбрано';
              }
              if (row.cells.map((item) => item.data)[11] == true){
                option2.innerHTML = 'Выбрано';
              }

              
            }
            
          }, 'Смотреть');
        }
      },
      { 
        name: 'Продолжительность',
        hidden: true
      },
      { 
        name: 'Интерактивный путеводитель',
        hidden: true
      },
      { 
        name: 'Вторая опция',
        hidden: true
      },],
      pagination: {
        limit: 5
      },
      sort: !0,
      search: !0,
      data: orders.map((order) => ([
        order.id,
        order.guid.name,
        order.route.name,
        order.price,
        order.date,
        order.persons,
        order.guide_id,
        order.route_id,
        order.time,
        order.duration,
        order.optionFirst,
        order.optionSecond
      ]))
    });
    ordersTable.render(orderListRef);
  }
renderOrders();