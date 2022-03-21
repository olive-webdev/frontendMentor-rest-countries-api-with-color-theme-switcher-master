fetch("https://restcountries.com/v3.1/all")
   .then((res) => res.json())
     .then((res) => {
         localStorage.setItem("countries", JSON.stringify(res))
});
ID = (id) => {
  return document.getElementById(id);
};

nospace = (name) => {
  return name.includes(" ") ? name.replaceAll(" ", "") : name;
};

const container = ID("container"),
  country = ID("country"),
  countriesSuggested = ID("countriesSuggested"),
  countries = JSON.parse(localStorage.getItem("countries"));

function separateNumberByComma(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
  return val;
}

resetDom = (dom) => {
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  }
};
function feed(country) {
  let countryToDisplay = `
        <div id="${nospace(
          country.name.common
        )}" class="country shadow" onclick="getDetails(${nospace(
    country.name.common
  )})">
            <div class="flag">
                <img src="${
                  country.flags.svg
                }" class="shadow" alt="" loading="lazy">
            </div>
            <p>${country.name.common}</p>
            <p>Population: <span>${separateNumberByComma(
              Number(country.population)
            )}</span></p>
            <p>Region: <span>${country.region}</span></p>
            <p>Capital: <span>${country.capital}</span></p>
        </div>`;
  container.insertAdjacentHTML("beforeend", countryToDisplay);
}
function feedDetails(country) {
  findNameFromTag = (tag) => {
    countries.forEach((country) => {
      if (tag === country.cca3) {
        borders += `<button class="shadow" onclick="displayDetails('${nospace(
          country.name.common
        )}')">${country.name.common}</button>`;
      }
    });
  };

  let languages = [];
  if (country["languages"]) {
    country["languages"] &&
      Object.keys(country["languages"]).forEach((lang) => {
        languages.push(" " + country.languages[lang]);
      });
  } else languages = ["not specified"];

  let borders = "";
  if (country["borders"]) {
    Object.keys(country["borders"]).forEach((border) => {
      findNameFromTag(country.borders[border]);
    });
  } else borders = "no border country";

  let currencies = [];
  if (country["currencies"]) {
    Object.keys(country["currencies"]).forEach((currency) => {
      currencies.push(country.currencies[currency]["name"]);
    });
  } else currencies = ["not specified"];

  let nativeName = [];
  if (country.name.nativeName) {
    Object.keys(country.name.nativeName).forEach((native) => {
      nativeName.push(" " + country.name.nativeName[native].common);
    });
  } else nativeName = ["not specified"];

  let countryToDisplay =
    `
      <div id="${country.name.common}">
          <img src="${country.flags.svg}" class="shadow" alt="">
          <div>
            <p id="countryName">${country.name.common}</p>
            <div id="infos">
              <div id="info1">
                <p>Native Name: <span>${nativeName}</span></p>
                <p>Population: <span>${separateNumberByComma(
                  Number(country.population)
                )}</span></p>
                <p>Region: <span>${country.region}</span></p>
                <p>Sub Region: <span>${
                  country.subregion || "not specified"
                }</span></p>
                <p>Capital: <span>${
                  country.capital || "not specified"
                }</span></p>
              </div>
              <div id="info2">
                <p>Top Level Domain: <span>${
                  country.tld[0] || "none"
                }</span></p>
                <p>Currencies: <span>${currencies}</span></p>
                <p>Languages: <span>${languages}</span></p>
              </div>
            </div>
            <div id="borders"><p>Border Countries:</p>` +
    borders +
    `</div>
          </div>
      </div>`;
  ID("insertDetails").insertAdjacentHTML("beforeend", countryToDisplay);
}

displayCountries = (filter) => {
  resetDom(countriesSuggested);
  resetDom(container);
  resetDom(ID("insertDetails"));
  countries.forEach((country) => {
    if (filter === "all") {
      feed(country);
    }
    if (country.region == filter) {
      feed(country);
    }
    if (country.name.common == filter) {
      feed(country);
    }
  });
};

displayDetails = (filter) => {
  resetDom(ID("insertDetails"));
  countries.forEach((country) => {
    if (nospace(country.name.common) == filter) {
      feedDetails(country);
    }
  });
};

displayCountries("all");

function getDetails(data) {
  document.location.href = "/#details";
  inputCountry.value = "";
  displayDetails(data.id);
}
function getHome() {
  displayCountries("all");
  document.location.href = "/#home";
}
/* -------------------------------- FILTERING ------------------------------- */
toggleRegions = () => {
  if (ID("filterButton").checked == true) {
    ID("regions").classList.remove("none");
  } else ID("regions").classList.add("none");
};
window.onclick = (e) => {
  if (e.target.id !== "labelButton" && e.target.id !== "filterButton") {
    ID("regions").classList.add("none");
    ID("filterButton").checked = false;
  }
};
/* ---------------------------- SUGGESTS ON INPUT --------------------------- */
inputCountry.oninput = () => {
  if (inputCountry.value.length === 0) {
    displayCountries("all");
  }
  resetDom(countriesSuggested);
  if (inputCountry.value.length > 1) {
    countries.forEach((country) => {
      if (
        country.name.common.toLowerCase().includes(inputCountry.value) ||
        country.name.official.toLowerCase().includes(inputCountry.value)
      ) {
        countriesSuggested.insertAdjacentHTML(
          "beforeend",
          `<p onclick="displayCountries('${country.name.common}')">
                  ${country.flag} ${country.name.common} / ${country.name.official}</p>`
        );
      }
    });
  }
};
/* -------------------------------- DARKMODE -------------------------------- */
ID("darkmode").onchange = (e) => {
  if (e.target.checked == true) {
    document.querySelector("body").classList.replace("lightmode", "darkmode");
  } else {
    document.querySelector("body").classList.replace("darkmode", "lightmode");
  }
};
