const apiKey = 'f24a0fd18f52218851075901c5a108a0';
const baseUrl = 'https://api.themoviedb.org/3/search/movie';
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
const latestUrl = `https://api.themoviedb.org/3/movie/latest?api_key=${apiKey}`;
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const queryInput = document.querySelector('#requestInput');
const searchButton = document.querySelector('#submitButton');
const form = document.querySelector('#requestForm');
const galery = document.querySelector('#galery-container');
const popularBtn = document.querySelector('.popular-Btn');
const latestBtn = document.querySelector('.latest-Btn');
const topRatedBtn = document.querySelector('.toprated-Btn');
const lightBtn = document.querySelector('.light-theme');
const darkBtn = document.querySelector('.dark-theme');
const styleBlock = document.querySelector('.color-theme');



//проверка поддержки localStorage

const tryStorage = () => {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};


//запрос на сайт
const startSearch = (searchString) =>
    fetch(searchString)
    .then(response => {
        if (response.ok) return response.json();
        throw new Error("Error fetching data");
    })
    .catch(err => console.log(err));

//выбор нужных полей из полученных данных    
const makeDataObject = dataFromBase =>
    dataFromBase.map(card => ({
        title: card.title,
        posterUrl: `https://image.tmdb.org/t/p/w500${card.poster_path}`,
        description: card.overview,
        date: card.release_date,
        rating: card.vote_average
    }));


//Выбор нужных полей из запроса 'latest'
const makeDataLatest = dataFromBase => {
    let card = {
        title: dataFromBase.title,
        posterUrl: `https://image.tmdb.org/t/p/w500${dataFromBase.poster_path}`,
        description: dataFromBase.overview,
        date: dataFromBase.release_date,
        rating: dataFromBase.vote_average
    }
    let cards = [card];
    return cards;
};

//рендеринг галереи
const renderGalery = (items, parentElem) => {
    const galeryItem = document.querySelector('#galery-item').textContent.trim();
    const compiled = _.template(galeryItem);
    let htmlString = '';
    items.forEach(item => {
        htmlString += compiled(item);
    });
    parentElem.innerHTML = htmlString;
};

//ивент подтверждения формы
form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (queryInput.value) {
        let searchStr = `${baseUrl}?api_key=${apiKey}&query=${queryInput.value}`;
        startSearch(searchStr)
            .then(data => {
                let selectedData = makeDataObject(data.results);
                queryInput.value = '';
                renderGalery(selectedData, galery);
            });
    } else alert('Введите хоть что нибудь');
});

//ивенты нажатия кнопок
popularBtn.addEventListener('click', () => {
    startSearch(popularUrl)
        .then(data => {
            let selectedData = makeDataObject(data.results);
            renderGalery(selectedData, galery);
        });
});

latestBtn.addEventListener('click', () => {
    startSearch(latestUrl)
        .then(data => {
            let selectedData = makeDataLatest(data);
            renderGalery(selectedData, galery);
        });
});

topRatedBtn.addEventListener('click', () => {
    startSearch(topRatedUrl)
        .then(data => {
            let selectedData = makeDataObject(data.results);
            renderGalery(selectedData, galery);
        });
});

if (tryStorage()) {
    let currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        styleBlock.href = currentTheme;
    } else {
        styleBlock.href = "css/light-theme.css";
    };
} else {
    console.log('localStorage не поддерживается')
};

if (styleBlock.getAttribute('href') == "css/light-theme.css") {
    lightBtn.classList.add('selected');
    darkBtn.classList.remove('selected');
} else {
    darkBtn.classList.add('selected');
    lightBtn.classList.remove('selected');

};

lightBtn.addEventListener('click', () => {
    styleBlock.href = "css/light-theme.css";
    lightBtn.classList.add('selected');
    darkBtn.classList.remove('selected');
    if (tryStorage()) {
        localStorage.setItem('theme', 'css/light-theme.css')
    };
});

darkBtn.addEventListener('click', () => {
    styleBlock.href = "css/dark-theme.css";
    darkBtn.classList.add('selected');
    lightBtn.classList.remove('selected');
    if (tryStorage()) {
        localStorage.setItem('theme', 'css/dark-theme.css')
    };
});