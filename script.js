'use strict';

    
const input = document.getElementById('select-cities');

let data = {};


// Формируем верстку блока
const listDefault = document.querySelector('.dropdown-lists__list--default'),
    listCol = listDefault.querySelector('.dropdown-lists__col'),
    select = document.querySelector('.dropdown-lists__list--select'),
    colSelect = select.querySelector('.dropdown-lists__col'),
    btn = document.querySelector('.button'),
    close = document.querySelector('.close-button'),
    label = document.querySelector('.label');


input.addEventListener('click', () => {
    if (listCol.querySelectorAll('div').length === 0){
        listDefault.classList.add('loader');
        const request = new XMLHttpRequest();
            request.open('GET', './db_cities.json');
            request.setRequestHeader('Content-type', 'application/json');
            request.send();
            request.addEventListener('readystatechange', () => {
                if (request.readyState === 4 && request.status === 200) {
                    
                    setTimeout(()=>{
                        listDefault.classList.remove('loader');
                        data = JSON.parse(request.responseText);
                        formData();
                    },1000);
                    
                } else {
                input.textContent = 'Произошла ошибка';
                }
            });
    }
});






//блокировка кнопки 
    btn.setAttribute('disabled', 'disabled');


// Кликаем на input и отображаются страны + 3 топовых города;
const formData = () => {
    if(listCol.textContent === ''){
        data.RU.forEach(item =>{
            const countryBlock = document.createElement('div'),
            totalLine = document.createElement('div'),
            listCountry =  document.createElement('div'),
            listCount =  document.createElement('div');

            countryBlock.classList.add('dropdown-lists__countryBlock');
            totalLine.classList.add('dropdown-lists__total-line');
            listCountry.classList.add('dropdown-lists__country');
            listCount.classList.add('dropdown-lists__count');
            
            listCountry.textContent = item.country;
            listCount.textContent = item.count;

            totalLine.appendChild(listCountry);
            totalLine.appendChild(listCount);
            countryBlock.appendChild(totalLine);
            listCol.appendChild(countryBlock);
            
            
            let sortArr = item.cities.map((curretntValue, i)=>{
                return item.cities[i].count;
            });
            sortArr.sort((a, b)=> b - a);


            item.cities.forEach(cityItem => {

                if (cityItem.count == sortArr[0] || cityItem.count == sortArr[1] || cityItem.count == sortArr[2]){
                    const listLine = document.createElement('div'),
                    listCity = document.createElement('div'),
                    listCount= document.createElement('div');

                    listLine.classList.add('dropdown-lists__line');
                    listCity.classList.add('dropdown-lists__city');
                    listCount.classList.add('dropdown-lists__count');

                    listCity.textContent = cityItem.name;
                    listCount.textContent = cityItem.count;
                    
                    listLine.appendChild(listCity);
                    listLine.appendChild(listCount);
                    countryBlock.appendChild(listLine);
                }
            });
        });
    }
};


//Подсвечивает текст оранжевым при наведении мыши
const selText = () =>{
    let target = event.target;
    
    if(target.closest('.dropdown-lists__line')){
        target = target.closest('.dropdown-lists__line');
        target.classList.add('dropdown-lists__city--ip');
    } else if(target.closest('.dropdown-lists__total-line')) {
        target = target.closest('.dropdown-lists__total-line');
        target.classList.add('dropdown-lists__city--ip');
    }
}
listCol.addEventListener('mouseover', event =>{
    selText();
});

listCol.addEventListener('mouseout', event =>{
    const target = event.target;
    target.classList.remove('dropdown-lists__city--ip');
});

// При нажатии на страну формирование списка городов этой страны

let interval;
let count = 0,
    value;
const openDisplayCities = () => {
    interval = requestAnimationFrame(openDisplayCities);
        if(count < 210){
            select.style.width = value;
            count+= 10;
            value = count + 'px';
        } else{
            cancelAnimationFrame(interval);
        }
};

const closeDisplayCities = () => {
    interval = requestAnimationFrame(closeDisplayCities);
        if(count > 0){
            select.style.width = value;
            count-= 10;
            value = count + 'px';
        } else{
            cancelAnimationFrame(interval);
            select.style.display = 'none';
            
        }
}


const countryBlock = document.createElement('div'),
        totalLine = document.createElement('div'),
        listCountry =  document.createElement('div'),
        listCount =  document.createElement('div');

        countryBlock.classList.add('dropdown-lists__countryBlock');
        totalLine.classList.add('dropdown-lists__total-line');
        listCountry.classList.add('dropdown-lists__country');
        listCount.classList.add('dropdown-lists__count');
            
        totalLine.appendChild(listCountry);
        totalLine.appendChild(listCount);
        countryBlock.appendChild(totalLine);
        colSelect.appendChild(countryBlock);

listCol.addEventListener('click', event => {
                
    if (listCountry.textContent == ''){
        
    
        let target = event.target;
        target = target.closest('.dropdown-lists__total-line');
        if(target){
          
            let country = target.querySelector('.dropdown-lists__country')
            data.RU.forEach(item =>{
                if(country.textContent === item.country){
                    listCountry.textContent = item.country;
                    listCount.textContent = item.count;
                    item.cities.forEach(cityItem =>{
                    const listLine = document.createElement('div'),
                        listCity = document.createElement('div'),
                        listCount= document.createElement('div');

                        listLine.classList.add('dropdown-lists__line');
                        listCity.classList.add('dropdown-lists__city');
                        listCount.classList.add('dropdown-lists__count');

                        listCity.textContent = cityItem.name;
                        listCount.textContent = cityItem.count;
                        
                        listLine.appendChild(listCity);
                        listLine.appendChild(listCount);
                        countryBlock.appendChild(listLine);
                    });
                }
            });

            select.style.display = 'block';
            select.style.width = '0px';
            openDisplayCities();
           
        
        }
    }
});

// убрать список по нажатии на страну в доп окне
const totalLineSel = select.querySelector('.dropdown-lists__total-line');

totalLineSel.addEventListener('click', () =>{
    closeDisplayCities();
    listCountry.textContent = '';
    listCount.textContent = '';
    const selCountryBlock = select.querySelector('.dropdown-lists__countryBlock'), 
    cities = selCountryBlock.querySelectorAll('.dropdown-lists__line');
    cities.forEach(item =>{
        selCountryBlock.removeChild(item);
    })
    
});

// вводим значение в тектстовое поле и проводим поиск

const autocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
autoBlock = autocomplete.querySelector('.dropdown-lists__countryBlock');


input.addEventListener('input', () => {
    autocomplete.style.display = 'block';
    select.style.display = 'none';
    listDefault.style.display = 'none';
    autoBlock.textContent = '';
    data.RU.forEach(item => {
        item.cities.forEach(cityItem => {
            
                if(input.value.toLowerCase() === cityItem.name.slice(0, input.value.length).toLowerCase()){
                    
                    const listLine = document.createElement('div'),
                    listCity = document.createElement('div'),
                    listCount= document.createElement('div'),
                    b = document.createElement('b'),
                    p = document.createElement('p');
    
                    listLine.classList.add('dropdown-lists__line');
                    listCity.classList.add('dropdown-lists__city');
                    listCount.classList.add('dropdown-lists__count');
                    
                   
                    b.textContent = cityItem.name.slice(0, input.value.length);
                    p.textContent = cityItem.name.slice(input.value.length, cityItem.name.length);
                   
                    
                    listCity.appendChild(b);
                    listCity.appendChild(p);
                    p.style.display = 'inline';
                    listCount.textContent = cityItem.count;
                            
                    listLine.appendChild(listCity);
                    listLine.appendChild(listCount);
                    autoBlock.appendChild(listLine);

                    /* Хороший был вариант с выдилением, но на часть слова не работает, к сожалению
                    let range = new Range();
                    const listCities = listLine.querySelectorAll('.dropdown-lists__city');
                    console.log(input.value.length);
                    listCities.forEach(item =>{
                        range.setStart(item, 0);
                        range.setEnd(item, 1);
                        range.surroundContents(b);
                        console.log(range);
                    })  
                    */  
                }
        });
    });
    
    if(input.value !=='' && autoBlock.textContent === ''){
        autoBlock.textContent = 'По вашему запросу ничего не найдено';
        btn.removeAttribute('href');
        
    }

    if (input.value === ''){
        autocomplete.style.display = 'none';
        listDefault.style.display = 'block';
        label.style.display = 'block';
        btn.setAttribute('disabled', 'disabled');
        
    } 
    
});

// по клику на город всплытие названия в инпуте + ссылка на кнопке

const clickCity = () => {
    let target = event.target;

    target = target.closest('.dropdown-lists__line');
    if (target){
       const city = target.querySelector('.dropdown-lists__city');
             
       data.RU.forEach(item =>{
           item.cities.forEach(cityItem =>{
                
               if(city.textContent === cityItem.name){
                   btn.removeAttribute('disabled');
                   btn.setAttribute('href', cityItem.link);
                   
                   label.style.display = 'none';
                   input.value = cityItem.name;
                   close.style.display = 'block';
               }
           })
       })
    }
}

listCol.addEventListener('click', event => {
    clickCity();
});
colSelect.addEventListener('click', event => {
    clickCity();
});
autoBlock.addEventListener('click', event => {
    clickCity();
});

//присвоение функциональности крестику
close.addEventListener('click', () =>{
    input.value = '';
    close.style.display = 'none';
    btn.setAttribute('disabled', 'disabled');
    btn.removeAttribute('href');
    listDefault.style.display = 'block';
    autocomplete.style.display = 'none';
});

colSelect.addEventListener('mouseover', event =>{
    selText();
});

colSelect.addEventListener('mouseout', event =>{
    const target = event.target;
    target.classList.remove('dropdown-lists__city--ip');
});
