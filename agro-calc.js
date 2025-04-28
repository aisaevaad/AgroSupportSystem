const cropData = {
    tomato: {
        name: 'Помидоры',
        baseN: 30,
        baseP: 40,
        baseK: 50,
        stages: [
            { phase: 'Вегетация', N: 0.6, P: 0.3, K: 0.1 },
            { phase: 'Цветение', N: 0.3, P: 0.5, K: 0.2 },
            { phase: 'Плодоношение', N: 0.2, P: 0.3, K: 0.5 }
        ]
    },
    cucumber: {
        name: 'Огурцы',
        baseN: 40,
        baseP: 30,
        baseK: 35,
        stages: [
            { phase: 'Рост', N: 0.5, P: 0.3, K: 0.2 },
            { phase: 'Цветение', N: 0.3, P: 0.4, K: 0.3 },
            { phase: 'Плодоношение', N: 0.2, P: 0.3, K: 0.5 }
        ]
    },
    pepper: {
        name: 'Перец овощной',
        baseN: 35,
        baseP: 35,
        baseK: 40,
        stages: [
            { phase: 'Рост', N: 0.6, P: 0.2, K: 0.2 },
            { phase: 'Цветение', N: 0.3, P: 0.5, K: 0.2 },
            { phase: 'Созревание', N: 0.1, P: 0.3, K: 0.6 }
        ]
    }
};

const soilCoefficients = {
    loam: { N: 1.0, P: 1.0, K: 1.0 },
    sand: { N: 1.2, P: 1.3, K: 1.2 },
    clay: { N: 0.8, P: 0.9, K: 0.8 }
};

const fertilityAdjustments = {
    low: { multiplier: 1.3, note: 'Требуется усиленное внесение удобрений' },
    medium: { multiplier: 1.0, note: 'Стандартные нормы' },
    high: { multiplier: 0.7, note: 'Сниженные нормы' }
};

document.getElementById('advancedCalc').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const crop = document.getElementById('crop').value;
    const area = parseFloat(document.getElementById('area').value);
    const soilType = document.getElementById('soilType').value;
    const fertility = document.getElementById('fertility').value;

    if (!crop || isNaN(area) || area <= 0) {
        alert('Проверьте введенные данные!');
        return;
    }

    const cropInfo = cropData[crop];
    const soilCoeff = soilCoefficients[soilType];
    const fertAdjust = fertilityAdjustments[fertility];

    // Базовый расчет
    let totalN = cropInfo.baseN * area;
    let totalP = cropInfo.baseP * area;
    let totalK = cropInfo.baseK * area;

    // Корректировка на тип почвы
    totalN *= soilCoeff.N;
    totalP *= soilCoeff.P;
    totalK *= soilCoeff.K;

    // Корректировка на плодородие
    totalN *= fertAdjust.multiplier;
    totalP *= fertAdjust.multiplier;
    totalK *= fertAdjust.multiplier;

    // Распределение по фазам
    const stageDetails = cropInfo.stages.map(stage => {
        return `
            <div class="stage">
                <strong>${stage.phase}:</strong>
                <ul>
                    <li>Азот (N): ${Math.round(totalN * stage.N)} г</li>
                    <li>Фосфор (P): ${Math.round(totalP * stage.P)} г</li>
                    <li>Калий (K): ${Math.round(totalK * stage.K)} г</li>
                </ul>
            </div>
        `;
    }).join('');

    // Общие рекомендации
    const tips = `
        <div class="alert alert-secondary mt-3">
            ${fertAdjust.note}
            Рекомендуется вносить удобрения в ${cropInfo.stages.length} этапа:
            ${cropInfo.stages.map((s, i) => `${i+1}. ${s.phase}`).join(', ')}.
        </div>
    `;

    // Вывод результатов
    document.getElementById('fertilizerDetails').innerHTML = `
        <h4>${cropInfo.name}</h4>
        <p>Общая потребность на ${area} м²:</p>
        <ul>
            <li>Азот (N): ${Math.round(totalN)} г</li>
            <li>Фосфор (P): ${Math.round(totalP)} г</li>
            <li>Калий (K): ${Math.round(totalK)} г</li>
        </ul>
    `;

    document.getElementById('applicationTips').innerHTML = stageDetails + tips;
    document.getElementById('results').classList.remove('d-none');
});