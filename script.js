const formSearch = document.querySelector('div');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');

const cities = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Одесса', 'Калининград', 'Киев', 'Нурсултан', 'Симферополь'];

const showCity = (input, list) => {

    dropdownCitiesFrom.textContent = '';
    dropdownCitiesTo.textContent = '';

    if (input.value !== '') {

        const filterCities = cities.filter((item) => {

            const cityLowerCase = item.toLowerCase();
            const valueLowerCase = input.value.toLowerCase();

            return cityLowerCase.includes(valueLowerCase);

        });

        filterCities.forEach((item) => {

            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);

        });

    };

};

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
   showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', () => {

    const target = event.target;

    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = target.textContent;
        dropdownCitiesFrom.textContent = '';
    };

});

dropdownCitiesTo.addEventListener('click', () => {

    const target = event.target;

    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesTo.value = target.textContent;
        dropdownCitiesTo.textContent = '';
    };
    
});