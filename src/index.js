
import { debounce } from 'lodash';
import { Notify } from 'notiflix';




const inputField = document.querySelector('#search-box')
const list = document.querySelector('.country-list')
const info = document.querySelector('.country-info')

async function getCountry(query) {
  return await fetch(`https://restcountries.com/v2/name/${query}?fields=name,capital,population,languages,flags`)
    .then(r => {
                if (r.status === 200) {
                    return r.json()
                }
            })
            .catch(error => console.log(error))
}


function renderData(data) {
  const { name, flags } = data
  data.map(({name, flags}) => {
    return list.insertAdjacentHTML('afterbegin',
                `<li class="list__item">
                    <div class="list__img-thumb">
                        <img src="${flags.png}" alt="flag-mini">
                    </div>
                    <p class="list__text">${name}</p>
                </li>
                `) 
  })
}

function renderInfo(countryInfo) {

        countryInfo.map(country => {
            const { name, capital, population, flags, languages } = country
            let language = languages.map(language => language.name).join(', ')

            return info.innerHTML = `
                <article class="card">
                    <div class="card__img-thumb">
                        <img src=${flags.png} alt="flags">
                        <h1 class="card__title">${name}</h1>
                    </div>
                    <p class="card__item"><b>capital: </b>${capital}</p>
                    <p class="card__item"><b>languages: </b>${language}</p>
                    <p class="card__item"><b>population: </b>${population}</p>
                </article>
                `
    })
}

function clearList() {
  list.textContent = ''
  info.textContent = ''
}

inputField.addEventListener('input',  debounce( async () => {
  let inputValue = inputField.value.trim()
  const minLetter = inputValue.length

  // Проверка на количество введенных букв
  if (minLetter >= 1) {
    clearList()

    let data = await getCountry(inputValue)
    let info = await getCountry(inputValue)

     await getCountry(inputValue)
      .then(countrysArray => {

        // Проверка если в массиве более 10 стран
        if (data.length >= 10) {
          list.textContent = ''
          return Notify.info('Too many matches found. Please enter a more specific name') 
              // Проверка если в массиве 1 страна - рендерим её инфо
        } else if (data.length === 1) {
          if (info)  renderInfo(info)
             
            //   // Проверка если в массиве стран больше 1 и меньше 10 - рендерим список стран
            } else if (data.length < 10 && data.length >= 2) {
             if (data) renderData(data)
            } 
          })
          .catch(error => Notify.failure('Oops, there is no country with that name'))
          // Очистка всего контента , если в инпуте пустая строка
          }  else if (minLetter === 0) {
          clearList()
        }
      }), 3000)
  
