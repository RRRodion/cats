const url = new URL('https://cataas.com');

//теги
(function getTags() {
    const tagsSelect = document.getElementById("tags");
    const tagsUrl = new URL('/api/tags', url);

    fetch(tagsUrl.href)
        .then(response => response.json())
        .then(data => {
            data.filter(tag => tag !== '').forEach(tag => { // Фильтрация пустых тегов
                const option = document.createElement("option");
                option.value = tag;
                option.text = tag;
                tagsSelect.appendChild(option);
            });
            data.forEach(tag => {
                const option = document.createElement("option");
                option.value = tag;
                option.text = tag;
                tagsSelect.appendChild(option);
            });
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
})()


document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('.catImage')
    const size = document.getElementById('size');
    const typeSelectElement = document.getElementById('type');
    const tagsSelectElement = document.getElementById('tags');
    const filterSelectElement = document.getElementById('filter');
    const textInputElement = document.getElementById('text');
    const fontSizeInputElement = document.getElementById('fontSize');
    const fontColorInputElement = document.getElementById('fontColor');
    const text = document.querySelector('.text')
    const buttonElement = document.querySelector('.sendBtn');

    text.style.display = 'none'

    buttonElement.addEventListener('click', () => {
        fetchImage()
    });

    function fetchImage() {
        const sizeValue = size.value;
        const typeValue = typeSelectElement.value;
        const tagsValue = Array.from(tagsSelectElement.selectedOptions).map(option => option.value).join(',');
        const filterValue = filterSelectElement.value;
        const textValue = textInputElement.value;
        const fontSizeValue = fontSizeInputElement.value;
        const fontColorValue = fontColorInputElement.value;
        const catUrl = new URL('/cat', url);
        const params = new URLSearchParams(catUrl.search);

        buttonElement.disabled = true;
        // фото или гиф
        if (typeValue === 'gif') {
            catUrl.pathname += '/gif';
        }
        // теги
        if (tagsValue !== '') {
            catUrl.pathname += `/${tagsValue}`;
        }
        // текст
        if (textValue.trim() !== '') {
            catUrl.pathname += `/says/${encodeURIComponent(textValue.trim())}`;

            if (fontSizeValue !== '') {
                params.set('fontSize', fontSizeValue);
            }

            if (fontColorValue !== '') {
                params.set('fontColor', fontColorValue);
            }
        }

        // размер
        if (sizeValue !== '') {
            params.set('type', sizeValue);
        }
        // фильтр
        if (filterValue !== '') {
            params.set('filter', filterValue);
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
                img.src = response.url;
                img.onload = () => {
                    buttonElement.disabled = false;
                    text.style.display = 'none';
                    img.style.display = 'block';
                };
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                img.style.display = 'none';
                text.style.display = 'block';
                buttonElement.disabled = false;
            });
    }
});

