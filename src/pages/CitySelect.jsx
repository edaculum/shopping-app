import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CitySelect({ onChange }) {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/shopping/sehirler');
                setCities(response.data);
            } catch (err) {
                console.error('Failed to fetch cities', err);
            }
        };

        fetchCities();
    }, []);

    return (
        <select onChange={(e) => onChange(e.target.value)} defaultValue="">
            <option value="">Şehir Seçin</option>
            {cities.map((city) => (
                <option key={city.id} value={city.id}>
                    {city.name}
                </option>
            ))}
        </select>
    );
}

export default CitySelect;

