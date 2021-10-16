"use strict";

const buttonSearch = document.querySelector(".fa-search");
const inputCountry = document.querySelector(".inputCountry");
const selectorRegions = document.querySelector("#selector-regions");
const countriesContainer = document.getElementById("countries-container");
const optionsRegions = document.querySelectorAll(".region");
const switcher = document.querySelector(".switcher-mode");
const switchIcon = document.querySelector(".switch-icon");
const header = document.getElementsByTagName("header")[0];
const seacher = document.getElementById("search-menu");
const body = document.body;
let statusSwitcher = localStorage.getItem("statusSwitcher");
if (statusSwitcher == undefined) {
  statusSwitcher = "off";
}
const setDark = () => {
  if (statusSwitcher === "on") {
    switchIcon.classList.replace("far", "fas");
    header.classList.add("header-dark");
    seacher.classList.add("dark");
    countriesContainer.classList.add("dark");
    body.style = "background: hsl(207, 26%, 17%)";
  } else {
    switchIcon.classList.replace("fas", "far");
    header.classList.remove("header-dark");
    seacher.classList.remove("dark");
    countriesContainer.classList.remove("dark");
    body.style = "background: hsl(0, 0%, 98%)";
  }
};

setDark();

const requestCuntries = async () => {
  const url = `https://restcountries.com/v3.1/all`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("WARN", response.status);
  const data = await response.json();
  const countries = data.map(({ name, population, region, capital, flags, cca2 }) => {
    return {
      name,
      population,
      region,
      capital,
      flags,
      cca2
    };
  });

  countries.sort((a,b) =>{
    let nameA = a.name.common.toUpperCase();
    let nameB = b.name.common.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  })
  return countries;
};


const listCountries = async () => {
  const countries = await requestCuntries();
  for (let i = 0; i < countries.length; i++) {
    const name = countries[i].name.common;
    const population = countries[i].population;
    const region = countries[i].region;
    const capital = countries[i].capital;
    const flag = countries[i].flags.svg;
    const cca2 = countries[i].cca2;

    const populationWithComma = addCharacter(population.toString(), ",", 3);

    //CREATE COUNTRY CARD
    const countryCard = document.createElement("div");
    countryCard.classList.add("country");
    countryCard.id = `${name}`;

    //SETT COUNTRY IMG-FLAG
    const imgFlag = document.createElement("img");
    imgFlag.classList.add("img-flag");
    imgFlag.src = flag;
    const urlToAllInfo = document.createElement("a");
    urlToAllInfo.href = "./pages/country.html";
    urlToAllInfo.append(imgFlag);
    urlToAllInfo.classList.add("img-flag-link");

    //CREATE DESCRIPTION AREA OF COUNTRY CARD
    const descriptionArea = document.createElement("div");
    descriptionArea.classList.add("description");

    const nameCountryTitle = document.createElement("h3");
    nameCountryTitle.classList.add("country-name");
    nameCountryTitle.textContent = name;

    const populationText = document.createElement("p");
    const populationTextDefault = document.createElement("strong");
    populationTextDefault.innerText = "Population: ";
    populationText.append(populationTextDefault);
    populationText.innerHTML += populationWithComma;

    const regionText = document.createElement("p");
    const regionTextDefault = document.createElement("strong");
    regionTextDefault.innerText = "Region: ";
    regionText.append(regionTextDefault);
    regionText.innerHTML += region;

    const capitalText = document.createElement("p");
    const capitalTextDefault = document.createElement("strong");
    capitalTextDefault.innerText = "Capital: ";
    capitalText.append(capitalTextDefault);
    capitalText.innerHTML += capital;

    //APPENDS
    descriptionArea.append(
      nameCountryTitle,
      populationText,
      regionText,
      capitalText
    );
    countryCard.append(urlToAllInfo, descriptionArea);
    const documentFragment = document.createDocumentFragment();
    documentFragment.append(countryCard);

    countriesContainer.append(documentFragment);
    urlToAllInfo.addEventListener("click", () => {
      localStorage.setItem("pais", cca2);
      localStorage.setItem("statusSwitcher", statusSwitcher);
    });
  }
};

listCountries();

const addCharacter = (cadena, caracter, pasos) => {
  let cadenaConCaracteres = "";
  const longitudCadena = cadena.length;
  for (let i = 0; i < longitudCadena; i += pasos) {
    if (i + pasos < longitudCadena) {
      cadenaConCaracteres += cadena.substring(i, i + pasos) + caracter;
    } else {
      cadenaConCaracteres += cadena.substring(i, longitudCadena);
    }
  }
  return cadenaConCaracteres;
};

const findCountry = (words) => {
  selectorRegions.value = "all";
  if (words.length == 0) {
    const countriesCards = countriesContainer.children;
    for (let i = 0; i < countriesCards.length; i++) {
      countriesCards[i].setAttribute("style", "display:static");      
    }

  } else {
    const countriesNamesShowed = document.querySelectorAll(".country-name");
    const countriesCards = countriesContainer.children;
    for (let i = 0; i < countriesNamesShowed.length; i++) {
      if (
        !countriesNamesShowed[i].textContent
          .toLowerCase()
          .toString()
          .includes(words.toLowerCase())
      ) {
        countriesCards[i].setAttribute("style", "display:none");
      }else{
        countriesCards[i].setAttribute("style", "display:static");
      }
    }
  }
};

const countriesForRegion = async () => {
  if (selectorRegions.value != "all") {
    inputCountry.value = "";
    const region = selectorRegions.value;
    const url = `https://restcountries.com/v3.1/region/${encodeURI(
      region
    )}?fields=name`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("WARN", response.status);
    const countriesOfRegion = await response.json();
    const countriesNamesbyRegion = countriesOfRegion.map(
      ({ name }) => name.common
    );
    const currentCountriesShowed = countriesContainer.children;
    for (let i = 0; i < currentCountriesShowed.length; i++) {
      currentCountriesShowed[i].setAttribute("style", "display:static");
    }
    for (let i = 0; i < currentCountriesShowed.length; i++) {
      if (
        !countriesNamesbyRegion.includes(
          currentCountriesShowed[i].id.toString()
        )
      ) {
        currentCountriesShowed[i].setAttribute("style", "display:none");
      }
    }
  } else {
    const currentCountriesShowed = countriesContainer.children;
    for (let i = 0; i < currentCountriesShowed.length; i++) {
      currentCountriesShowed[i].setAttribute("style", "display:static");
    }
  }
};

const countryAlreadySet = (country) => {
  const countries = countriesContainer.children;
  for (let i = 0; i < countries.length; i++) {
    if (country == countries[i].id) {
      return true;
      // break;
    }
  }
};

//Events to start findCountry
buttonSearch.addEventListener("click", () => {
  const words = inputCountry.value.toString();
  findCountry(words);
});
inputCountry.addEventListener("keyup", () => {
  const words = inputCountry.value.toString();
  console.log(words);
  findCountry(words);
});

//Events to start CountriesForRegion

selectorRegions.addEventListener("change", () => {
  countriesForRegion();
});

//SWAP-THEME
switcher.addEventListener("click", () => {
  if (statusSwitcher === "off") {
    switchIcon.classList.replace("far", "fas");
    header.classList.add("header-dark");
    seacher.classList.add("dark");
    countriesContainer.classList.add("dark");
    body.style = "background: hsl(207, 26%, 17%)";
    statusSwitcher = "on";
  } else {
    switchIcon.classList.replace("fas", "far");
    header.classList.remove("header-dark");
    seacher.classList.remove("dark");
    countriesContainer.classList.remove("dark");
    body.style = "background: hsl(0, 0%, 98%)";
    statusSwitcher = "off";
  }
});
