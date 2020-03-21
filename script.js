//элементы макета какб
const formSearch          = document.querySelector('.form-search');
const inputCitiesFrom     = document.querySelector('.input__cities-from');
const dropdownCitiesFrom  = document.querySelector('.dropdown__cities-from');
const inputCitiesTo       = document.querySelector('.input__cities-to');
const dropdownCitiesTo    = document.querySelector('.dropdown__cities-to');
const inputDateDepart     = document.querySelector('.input__date-depart');
const cheapestTicket      = document.getElementById('cheapest-ticket');
const otherCheapTickets   = document.getElementById('other-cheap-tickets');

//данные data data so much data
//const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json';
const citiesAPI   = 'database/cities.json';
const proxy       = 'https://cors-anywhere.herokuapp.com/';
const tokenAPI    = '3aa50df42a60329088821a43e84ff7cf';
const calendar    = 'http://min-prices.aviasales.ru/calendar_preload';
const MAX_COUNT   = 20;

let cities = [];

 //функции
 //запросы запросики, мать их, ГЕТ-запрос короче
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


//выводим список городов как ни странно
const showCity = (input, list) => {

    list.textContent = '';

    if (input.value === '') return;

    const filterCities = cities.filter((item) => {

        const cityLowerCase = item.name.toLowerCase();
        const valueLowerCase = input.value.toLowerCase();

        return cityLowerCase.startsWith(valueLowerCase);

    });


    filterCities.forEach((item) => {

        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);

    });

};

//подставляем значение выбранного горда в инпут
const selectCity = (event, input, list) => {

    const target = event.target;
    
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    };

};

//получаем название города по коду аэропорта
const getCityName = (cityCode) => {
    const objCity = cities.find((item) => item.code === cityCode);
    return objCity.name;
};
 
//возвращаем количество пересадок в тексте
const getChanges = (n) => {
    if (n) {
        return n === 1 ? 'C 1 пересадкой': 'С 2 и более пересадками';
    } else {
        return 'Без пересадок';
    }ж
};

//переформатируем дату в привычную
const transformDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getLinkAviasales = (data) => {
    let link = 'https://aviasales.ru/search/';

    link += data.origin;
    const date = new Date(data.depart_date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    link += day < 10 ? '0' + day: day;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    return link + '1';
};

//создаем плашку билета, либо сообщаем, что нет билетов на дату
const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города:
                        <span class="city__name">${getCityName(data.origin)}</span>
                    </div>
                    <div class="date">${transformDate(data.depart_date)}</div>
                </div>
        
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getCityName(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div> 
        `;
    } else {
        deep = '<h3>К сожалению на теущую дату билетов не найдено.</h3>';
    };

    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};

//выводим плашку самого дешевого билета (шоп он был здоров)
const renderCheapDay = (tickets) => {
    cheapestTicket.innerHTML = ('beforeend', '<h2>Самый дешевый билет на выбранную дату</h2>');
    cheapestTicket.style.display = 'block';
    const ticket = createCard(tickets[0]);
    cheapestTicket.append(ticket);
};

//выводим все остальные билеты, но это не точно
const renderCheapYear = (tickets) => {
    otherCheapTickets.innerHTML = ('beforeend', '<h2>Самые дешевые билеты на другие даты</h2>');
    otherCheapTickets.style.display = 'block';
    tickets.sort((a,b) => a.value - b.value);

    for (let i = 0; i < tickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(tickets[i]);
        otherCheapTickets.append(ticket);
    };
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

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    };
        
    if (formData.from && formData.to) {

        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${tokenAPI}`;
    
        getData((calendar + requestData), (response) => {
            renderCheap(response, formData.when);

        });
    } else {
        alert('Введите корректное название города');
    };
    
});
//вызовы функций
getData(citiesAPI, (data) => {
    cities = JSON.parse(data).filter((item => item.name));

    cities.sort((a,b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        } else if ( a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    });

});