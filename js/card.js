let country = localStorage.getItem("pais");
let statusSwitcher = localStorage.getItem("statusSwitcher");
const countryContainer = document.querySelector(".country-information");
const header = document.getElementsByTagName("header")[0];
const body = document.body;
const btnBack = document.querySelector(".btn-back");
const switchIcon = document.querySelector(".switch-icon");
const switcherMode = document.querySelector(".switcher-mode");

const setDark = () => {
  if (statusSwitcher === "on") {
    header.classList.add("header-dark");
    switchIcon.classList.replace("far", "fas");
    body.style = "background: hsl(207, 26%, 17%)";
    btnBack.classList.add("dark");
    countryContainer.classList.add("dark");
  } else {
    header.classList.remove("header-dark");
    body.style = "background: hsl(0, 0%, 98%)";
    btnBack.classList.remove("dark");
    countryContainer.classList.remove("dark");
  }
};

setDark();

switcherMode.addEventListener("click", () => {
  if (statusSwitcher === "off") {
    header.classList.add("header-dark");
    switchIcon.classList.replace("far", "fas");
    body.style = "background: hsl(207, 26%, 17%)";
    btnBack.classList.add("dark");
    countryContainer.classList.add("dark");
    statusSwitcher = "on";
  } else {
    header.classList.remove("header-dark");
    body.style = "background: hsl(0, 0%, 98%)";
    btnBack.classList.remove("dark");
    countryContainer.classList.remove("dark");
    statusSwitcher = "off";
  }
});

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

const putInfoAboutCountry = async () => {
  const url = `https://restcountries.com/v2/alpha/${encodeURI(country)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("WARN", response.status);
  const data = await response.json();
  const {
    name,
    nativeName,
    population,
    region,
    subregion,
    capital,
    flags,
    topLevelDomain,
    currencies,
    languages,
    borders,
  } = data;

  const flag = flags.svg;
  const populationNumber = addCharacter(population.toString(), ",", 3);
  const flagCountry = document.createElement("img");
  flagCountry.classList.add("img-flag-country");
  flagCountry.src = flag + "";

  const countryName = document.createElement("h3");
  countryName.classList.add("name-country");
  countryName.innerText = name;

  const nativeNameText = document.createElement("p");
  nativeNameText.classList.add("native-name");
  const nativeNameTextDefault = document.createElement("strong");
  nativeNameTextDefault.innerText = "Native Name: ";
  nativeNameText.append(nativeNameTextDefault, nativeName);

  const populationText = document.createElement("p");
  populationText.classList.add("population");
  const populationTextDefault = document.createElement("strong");
  populationTextDefault.innerText = "Population: ";
  populationText.append(populationTextDefault, populationNumber);

  const regionText = document.createElement("p");
  regionText.classList.add("region");
  const regionTextDefault = document.createElement("strong");
  regionTextDefault.innerText = "Region: ";
  regionText.append(regionTextDefault, region);

  const subregionText = document.createElement("p");
  subregionText.classList.add("sub-region");
  const subregionTextDefault = document.createElement("strong");
  subregionTextDefault.innerText = "Sub Region: ";
  subregionText.append(subregionTextDefault, subregion);

  const capitalText = document.createElement("p");
  capitalText.classList.add("capital");
  const capitalTextDefault = document.createElement("strong");
  capitalTextDefault.innerText = "Capital: ";
  capitalText.append(capitalTextDefault, capital);

  const space1 = document.createElement("br");
  const space2 = document.createElement("br");
  const space3 = document.createElement("br");
  const space4 = document.createElement("br");

  const domainText = document.createElement("p");
  domainText.classList.add("domain");
  const domainTextDefault = document.createElement("strong");
  domainTextDefault.innerText = "Top Level Domain: ";
  domainText.append(domainTextDefault, topLevelDomain[0]);

  const currencyText = document.createElement("p");
  currencyText.classList.add("currencies");
  const currencyTextDefault = document.createElement("strong");
  currencyTextDefault.innerText = "Currencies: ";
  currencyText.append(currencyTextDefault);
  currencies.forEach(({ name }, i) => {
    if (i < currencies.length - 1) {
      currencyText.append(name, ", ");
    } else {
      currencyText.append(name);
    }
  });

  const languagestext = document.createElement("p");
  languagestext.classList.add("languajes");
  const languagestextDefault = document.createElement("strong");
  languagestextDefault.innerText = "Languages: ";
  languagestext.append(languagestextDefault);

  languages.forEach(({ name }, i) => {
    if (i < languages.length - 1) {
      languagestext.append(name, ", ");
    } else {
      languagestext.append(name);
    }
  });

  const borderText = document.createElement("h4");
  borderText.innerText = "Border Countries:";
  borderText.classList.add("border-text");

  const bordersContainer = document.createElement("div");
  bordersContainer.classList.add("border-countries");
  console.log(borders);
  if (borders != undefined) {
    borders.forEach(async (element) => {
      const data = await fetch(
        `https://restcountries.com/v3.1/alpha/${encodeURI(element)}`
      );
      const [country]= await data.json();
      const {name} = country;
      const div = document.createElement("div");
      div.append(name.common);
      bordersContainer.append(div);
    });
  
  }else{
      const div = document.createElement("div");
      div.append('none');
      bordersContainer.append(div);
  }
  
  const countryData = document.createElement("div");
  countryData.classList.add("country-data");

  const dataTextCountry = document.createElement("div");
  dataTextCountry.classList.add("data-text-country");

  const dataBorder = document.createElement("div");
  dataBorder.classList.add("data-border");

  countryContainer.append(flagCountry, countryData);

  countryData.append(countryName, dataTextCountry, dataBorder);

  dataTextCountry.append(
    nativeNameText,
    populationText,
    regionText,
    subregionText,
    capitalText,
    space1,
    space2,
    domainText,
    currencyText,
    languagestext,
    space3,
    space4
  );

  dataBorder.append(borderText, bordersContainer);
};

putInfoAboutCountry();

btnBack.addEventListener('click', () =>{

  localStorage.setItem("statusSwitcher", statusSwitcher);
});