//
const formSearch          = document.querySelector('div');
const inputCitiesFrom     = document.querySelector('.input__cities-from');
const dropdownCitiesFrom  = document.querySelector('.dropdown__cities-from');
const inputCitiesTo       = document.querySelector('.input__cities-to');
const dropdownCitiesTo    = document.querySelector('.dropdown__cities-to');
const inputDateDepart     = document.querySelector('.input__date-depart');

//данные
//const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json';
const citiesAPI = 'database/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const tokenAPI = '3aa50df42a60329088821a43e84ff7cf';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';
let cities = [];
const fullURL = calendar + '?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true&token=' + tokenAPI;

 //функции
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

  //  request.setRequestHeader('X-Access-Token', tokenAPI);

    request.addEventListener('readystatechange', () => {
        
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        };

    });

    request.send();
}; 

const showCity = (input, list) => {

    dropdownCitiesFrom.textContent = '';
    dropdownCitiesTo.textContent = '';

    if (input.value === '') return;

    const filterCities = cities.filter((item) => {

        const cityLowerCase = item.name.toLowerCase();
        const valueLowerCase = input.value.toLowerCase();

        return cityLowerCase.includes(valueLowerCase);

    });

    filterCities.forEach((item) => {

        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);

    });

};

const selectCity = (event, input, list) => {

    const target = event.target;
    
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    };

};

//обработчики событий
//обрабатываем ввод
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
   showCity(inputCitiesTo, dropdownCitiesTo);
});

//обрабатываем клики на списках
dropdownCitiesFrom.addEventListener('click', () => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', () => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

//вызовы функций
getData(citiesAPI, (data) => {
    cities = JSON.parse(data).filter((item => item.name));
});

getData(fullURL, (data) => {
    console.log(JSON.parse(data));
});
