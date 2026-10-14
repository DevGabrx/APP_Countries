const API_BASE_URL = '/api';
const PAGE_SIZE = 100;
const RESPONSE_FIELDS =
  'names.common,names.official,codes.alpha_2,codes.alpha_3,flag.url_svg,region,subregion,capitals,population,currencies,languages';

async function requestCountries(endpoint, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { signal });
  const result = await response.json();

  if (!response.ok || result.success === false) {
    const apiError = Array.isArray(result.errors)
      ? result.errors.map((error) => error.message).filter(Boolean).join(' ')
      : '';
    throw new Error(
      apiError ||
        `La API respondió con ${response.status}${response.statusText ? ` ${response.statusText}` : ''}.`,
    );
  }

  return result.data ?? result;
}

function toCountry(country) {
  const codes = country.codes ?? {};
  const names = country.names ?? {};
  const alpha2 = codes.alpha_2 ?? country.cca2;
  const alpha3 = codes.alpha_3 ?? country.cca3;
  const flagUrl = country.flag?.url_svg || country.flags?.svg ||
    (alpha2 ? `https://flags.restcountries.com/v5/w320/${alpha2.toLowerCase()}.png` : '');
  const capitals = country.capitals ?? country.capital ?? [];
  const currencies = country.currencies ?? {};
  const languages = country.languages ?? {};

  return {
    ...country,
    cca3: alpha3,
    cca2: alpha2,
    name: {
      common: names.common ?? country.name?.common ?? '',
      official: names.official ?? country.name?.official ?? '',
    },
    flags: { ...country.flags, svg: flagUrl },
    capital: Array.isArray(capitals)
      ? capitals.map((capital) => typeof capital === 'string' ? capital : capital.name)
      : [],
    currencies: Array.isArray(currencies)
      ? Object.fromEntries(currencies.map((currency) => [currency.code, currency]))
      : currencies,
    languages: Array.isArray(languages)
      ? Object.fromEntries(
          languages.map((language) => [
            language.iso639_3 ?? language.iso639_1 ?? language.name,
            language.name,
          ]),
        )
      : languages,
  };
}

async function requestCountryList(filters = {}, { signal } = {}) {
  const countries = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const params = new URLSearchParams({
      ...filters,
      limit: String(PAGE_SIZE),
      offset: String(offset),
      response_fields: RESPONSE_FIELDS,
    });
    const result = await requestCountries(`?${params}`, { signal });
    const page = Array.isArray(result) ? result : result?.objects;

    if (!Array.isArray(page)) {
      throw new Error('La API no devolvió una lista de países.');
    }

    countries.push(...page.map(toCountry).filter((country) => country.cca3));
    if (result?.meta?.more !== true && page.length < PAGE_SIZE) return countries;
    if (result?.meta?.more === false) return countries;
  }
}

export function fetchAllCountries(options = {}) {
  return requestCountryList({}, options);
}

export function fetchCountriesByRegion(region, options = {}) {
  return requestCountryList({ region }, options);
}

export async function fetchCountryByCode(code, { signal } = {}) {
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!normalizedCode) {
    throw new Error('El código del país no es válido.');
  }

  const params = new URLSearchParams({
    q: normalizedCode,
    response_fields: RESPONSE_FIELDS,
  });
  const result = await requestCountries(`/code?${params}`, { signal });
  const page = Array.isArray(result) ? result : result?.objects;

  if (!Array.isArray(page)) {
    throw new Error('La API no devolvió resultados para el código del país.');
  }

  const countries = page.map(toCountry);
  const country = countries.find(
    (result) => result.cca3?.toUpperCase() === normalizedCode,
  );

  if (!country) {
    throw new Error('La API no encontró el país solicitado.');
  }

  return country;
}
