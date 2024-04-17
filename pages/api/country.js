import countryData from '../../data/countries.json';

export default function handler(req, res) {
  const { callingCode } = req.query;

  if (!callingCode) {
    return res.status(400).json({ error: 'Calling code is required' });
  }

  const country = countryData.find(c => c.callingCodes.includes(callingCode));

  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }

  res.status(200).json(country);
}