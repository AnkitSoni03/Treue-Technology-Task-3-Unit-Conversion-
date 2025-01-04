const unitData = {
    length: {
        units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
        conversions: {
            Meters: 1,
            Kilometers: 0.001,
            Centimeters: 100,
            Millimeters: 1000,
            Miles: 0.000621371,
            Yards: 1.09361,
            Feet: 3.28084,
            Inches: 39.3701
        }
    },
    weight: {
        units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tons'],
        conversions: {
            Kilograms: 1,
            Grams: 1000,
            Milligrams: 1000000,
            Pounds: 2.20462,
            Ounces: 35.274,
            Tons: 0.001
        }
    },
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        // Temperature needs special conversion functions
        special: true
    },
    area: {
        units: ['Square Meters', 'Square Kilometers', 'Square Miles', 'Square Feet', 'Square Inches', 'Acres', 'Hectares'],
        conversions: {
            'Square Meters': 1,
            'Square Kilometers': 0.000001,
            'Square Miles': 3.861e-7,
            'Square Feet': 10.7639,
            'Square Inches': 1550.0031,
            'Acres': 0.000247105,
            'Hectares': 0.0001
        }
    },
    volume: {
        units: ['Cubic Meters', 'Liters', 'Milliliters', 'Cubic Feet', 'Cubic Inches', 'Gallons'],
        conversions: {
            'Cubic Meters': 1,
            'Liters': 1000,
            'Milliliters': 1000000,
            'Cubic Feet': 35.3147,
            'Cubic Inches': 61023.7,
            'Gallons': 264.172
        }
    },
    time: {
        units: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'],
        conversions: {
            'Seconds': 1,
            'Minutes': 1/60,
            'Hours': 1/3600,
            'Days': 1/86400,
            'Weeks': 1/604800,
            'Months': 1/2592000,
            'Years': 1/31536000
        }
    }
};

const categorySelect = document.getElementById('category');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const fromValueInput = document.getElementById('fromValue');
const toValueInput = document.getElementById('toValue');
const formulaText = document.getElementById('formula');

function populateUnitSelectors(category) {
    const units = unitData[category].units;
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    units.forEach(unit => {
        fromUnitSelect.add(new Option(unit, unit));
        toUnitSelect.add(new Option(unit, unit));
    });
    
    if (units.length > 1) {
        toUnitSelect.selectedIndex = 1;
    }
}

function convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    if (fromUnit === 'Fahrenheit') {
        celsius = (value - 32) * 5/9;
    } else if (fromUnit === 'Kelvin') {
        celsius = value - 273.15;
    } else {
        celsius = value;
    }
    
    // Convert from Celsius to target unit
    if (toUnit === 'Fahrenheit') {
        return (celsius * 9/5) + 32;
    } else if (toUnit === 'Kelvin') {
        return celsius + 273.15;
    }
    return celsius;
}

// Main conversion function
function convert() {
    const category = categorySelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const fromValue = parseFloat(fromValueInput.value);

    if (isNaN(fromValue)) {
        toValueInput.value = '';
        formulaText.textContent = '';
        return;
    }

    let result;
    let formula = '';

    if (category === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
        formula = `${fromValue}°${fromUnit[0]} = ${result.toFixed(2)}°${toUnit[0]}`;
    } else {
        const conversionData = unitData[category].conversions;
        const fromFactor = conversionData[fromUnit];
        const toFactor = conversionData[toUnit];
        result = (fromValue / fromFactor) * toFactor;
        formula = `${fromValue} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
    }

    toValueInput.value = result.toFixed(4);
    formulaText.textContent = formula;
}

// Event listeners
categorySelect.addEventListener('change', () => {
    populateUnitSelectors(categorySelect.value);
    convert();
});

fromUnitSelect.addEventListener('change', convert);
toUnitSelect.addEventListener('change', convert);
fromValueInput.addEventListener('input', convert);

populateUnitSelectors(categorySelect.value);
