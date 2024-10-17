import countryData from '../../data/countries.json';

export default function handler(req, res) {
  const {
    name,
    fullName,
    code,
    codes,
    currency,
    lang,
    capital,
    callingCode,
    region,
    regionalBloc,
  } = req.query;

  // Count the number of query parameters provided
  const queryParams = [
    name,
    fullName,
    code,
    codes,
    currency,
    lang,
    capital,
    callingCode,
    region,
    regionalBloc,
  ].filter(Boolean).length;

  if (queryParams === 0) {
    return res.status(400).json({ error: 'At least one query parameter is required.' });
  }

  if (queryParams > 1) {
    return res.status(400).json({ error: 'Please provide only one query parameter at a time.' });
  }

  let results = [];

  if (name) {
    // Search by country name (partial or native)
    const lowerName = name.toLowerCase();
    results = countryData.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerName) ||
        c.nativeName.toLowerCase().includes(lowerName) ||
        (c.altSpellings && c.altSpellings.some((alt) => alt.toLowerCase().includes(lowerName)))
    );
  } else if (fullName) {
    // Search by full country name
    const lowerFullName = fullName.toLowerCase();
    results = countryData.filter((c) => c.name.toLowerCase() === lowerFullName);
  } else if (code) {
    // Search by ISO 3166-1 2-letter or 3-letter country code
    const upperCode = code.toUpperCase();
    results = countryData.filter(
      (c) => c.alpha2Code.toUpperCase() === upperCode || c.alpha3Code.toUpperCase() === upperCode
    );
  } else if (codes) {
    // Search by list of ISO 3166-1 2-letter or 3-letter country codes
    const codeList = codes.split(';').map((c) => c.trim().toUpperCase());
    results = countryData.filter((c) =>
      codeList.includes(c.alpha2Code.toUpperCase()) || codeList.includes(c.alpha3Code.toUpperCase())
    );
  } else if (currency) {
    // Search by ISO 4217 currency code
    const lowerCurrency = currency.toLowerCase();
    results = countryData.filter(
      (c) =>
        c.currencies &&
        c.currencies.some((curr) => curr.code && curr.code.toLowerCase() === lowerCurrency)
    );
  } else if (lang) {
    // Search by ISO 639-1 language code
    const lowerLang = lang.toLowerCase();
    results = countryData.filter(
      (c) =>
        c.languages &&
        c.languages.some((language) => language.iso639_1.toLowerCase() === lowerLang)
    );
  } else if (capital) {
    // Search by capital city
    const lowerCapital = capital.toLowerCase();
    results = countryData.filter((c) => c.capital.toLowerCase() === lowerCapital);
  } else if (callingCode) {
    // Search by calling code
    results = countryData.filter((c) => c.callingCodes.includes(callingCode));
  } else if (region) {
    // Search by region
    const lowerRegion = region.toLowerCase();
    results = countryData.filter((c) => c.region.toLowerCase() === lowerRegion);
  } else if (regionalBloc) {
    // Search by regional bloc
    const lowerBloc = regionalBloc.toLowerCase();
    results = countryData.filter(
      (c) =>
        c.regionalBlocs &&
        c.regionalBlocs.some((bloc) => bloc.acronym.toLowerCase() === lowerBloc)
    );
  }

  if (results.length === 0) {
    return res.status(404).json({ error: 'No countries found matching the query.' });
  }

  res.status(200).json(results);
}
