const url = new URL('https://cataas.com');
const buttonElement = document.querySelector('.sendBtn');
const text = document.querySelector('.text')

//теги
document.addEventListener('DOMContentLoaded', () => {
    const tagsSelect = document.getElementById("tags");

    fetchTags('/api/tags', url, tagsSelect);

    tagsSelect.addEventListener('change', function () {
        const options = tagsSelect.options;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.selected) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        }
    });
});

function fetchTags(apiPath, baseUrl, selectElement) {
    const tagsUrl = new URL(apiPath, baseUrl);

    fetch(tagsUrl.href)
        .then(response => response.json())
        .then(data => {
            data.filter(tag => tag !== '').forEach(tag => { // Фильтрация пустых тегов
                const option = document.createElement("option");
                option.value = tag;
                option.text = tag;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function getFormValues () {
    const catImage = document.querySelector('.catImage')
    const sizeSelectElement = document.getElementById('size');
    const typeSelectElement = document.getElementById('type');
    const tagsSelectElement = document.getElementById('tags');
    const filterSelectElement = document.getElementById('filter');
    const textInputElement = document.getElementById('text');
    const fontSizeInputElement = document.getElementById('fontSize');
    const fontColorInputElement = document.getElementById('fontColor');

    return {
        catImage,
        sizeValue: sizeSelectElement.value,
        typeValue: typeSelectElement.value,
        tagsValue: Array.from(tagsSelectElement.selectedOptions).map(option => option.value).join(','),
        filterValue: filterSelectElement.value,
        textValue: textInputElement.value,
        fontSizeValue: fontSizeInputElement.value,
        fontColorValue: fontColorInputElement.value,
        text,
    };
}

text.style.display = 'none'

buttonElement.addEventListener('click', () => {
    fetchImage()
});

function fetchImage() {
    const catUrl = new URL('/cat', url);
    const params = new URLSearchParams(catUrl.search);
    const variable = getFormValues();

    buttonElement.disabled = true;
    // фото или гиф
    if (variable.typeValue === 'gif') {
        catUrl.pathname += '/gif';
    }
    // теги
    if (variable.tagsValue !== '') {
        catUrl.pathname += `/${variable.tagsValue}`;
    }
    // текст
    if (variable.textValue.trim() !== '') {
        catUrl.pathname += `/says/${encodeURIComponent(variable.textValue.trim())}`;

        if (variable.fontSizeValue !== '') {
            params.set('fontSize', variable.fontSizeValue);
        }

        if (variable.fontColorValue !== '') {
            params.set('fontColor', variable.fontColorValue);
        }
    }

    // размер
    if (variable.sizeValue !== '') {
        params.set('type', variable.sizeValue);
    }
    // фильтр
    if (variable.filterValue !== '') {
        params.set('filter', variable.filterValue);
    }

    catUrl.search = params.toString();

    console.log(catUrl.href);

    fetch(catUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;

        })
        .then(response => {
            variable.catImage.src = response.url;
            variable.catImage.onload = () => {
                buttonElement.disabled = false;
                text.style.display = 'none';
                variable.catImage.style.display = 'block';
            };
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            variable.catImage.style.display = 'none';
            text.style.display = 'block';
            buttonElement.disabled = false;
        });
}
