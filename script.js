//элементы
const formSearch          = document.querySelector('.form-search');
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

    list.textContent = '';

    if (input.value === '') return;

    const filterCities = cities.filter((item) => {

        const cityLowerCase = item.name.toLowerCase();
        const valueLowerCase = input.value.toLowerCase();

        return cityLowerCase.startsWith(valueLowerCase);

    });

    filterCities.sort((a,b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        } else if ( a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        };
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

const renderCheapDay = (tickets) => {
    console.log(tickets);
};

const renderCheapYear = (tickets) => {
    tickets.sort((a,b) => a.value - b.value);
    console.log(tickets);
};

const renderCheap = (data, when) => {
    const cheapTickets = JSON.parse(data).best_prices;
    const cheapTicketsDay = cheapTickets.filter((item) => {
        return item.depart_date === when;
    });

    renderCheapDay(cheapTicketsDay);
    renderCheapYear(cheapTickets);
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
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {

    event.preventDefault();

    const cityFrom = cities.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = cities.find((item) => inputCitiesTo.value === item.name);

    if (cityFrom) {
        
        const formData = {
            from: cityFrom.code,
            to: cityTo.code,
            when: inputDateDepart.value,
        };
        
        const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${tokenAPI}`;
    
        getData((calendar + requestData), (response) => {
            renderCheap(response, formData.when);
        });

    };
    
});
//вызовы функций
getData(citiesAPI, (data) => {
    cities = JSON.parse(data).filter((item => item.name));
});