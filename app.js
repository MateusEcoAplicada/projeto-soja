// Navegação entre as páginas (Single Page Application simulada)
function navigate(pageId) {
    if (pageId !== 'cadeia') stopChainAnimation();
    if (pageId !== 'quiz') stopQuizTimer();

    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });

    // Remover classe 'active' de todos os links de navegação
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    // Mostrar a página selecionada
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }

    // Adicionar classe 'active' ao link clicado
    const navLink = document.getElementById(`nav-${pageId}`);
    if (navLink) {
        navLink.classList.add('active');
    }

    // Scroll para o topo
    window.scrollTo(0, 0);

    // Se for a página de mercado, inicializa o gráfico
    if (pageId === 'mercado' && !myChart && typeof Chart !== 'undefined') {
        initChart();
    }

    // Se for a página de quiz, inicializa o quiz
    if (pageId === 'quiz') {
        initQuiz();
    }
}

// ----------------------------------------------------
// PÁGINA: MERCADO DA SOJA (Gráfico)
// ----------------------------------------------------
let myChart = null;

const chartData = {
    '1y': {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        data: [13.2, 13.5, 12.8, 12.0, 12.2, 11.5, 11.8, 11.2, 10.8, 10.5, 10.7, 10.9]
    },
    '5y': {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        data: [9.5, 13.8, 16.5, 13.2, 11.0]
    },
    '10y': {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        data: [9.0, 10.2, 9.8, 8.5, 9.2, 9.5, 13.8, 16.5, 13.2, 11.0]
    },
    'all': {
        labels: ['2000','2005','2010','2015','2020','2024'],
        data: [4.5, 6.2, 11.0, 9.0, 9.5, 11.0]
    }
};

function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData['1y'].labels,
            datasets: [{
                label: 'Preço da Soja (US$/bushel)',
                data: chartData['1y'].data,
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1b5e20'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'US$ por Bushel' }
                }
            }
        }
    });
}

function updateChart(period) {
    if (!myChart) return;
    
    // Atualizar botões
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${period}`).classList.add('active');

    // Atualizar dados
    myChart.data.labels = chartData[period].labels;
    myChart.data.datasets[0].data = chartData[period].data;
    myChart.update();
}

// ----------------------------------------------------
// PÁGINA: CADEIA PRODUTIVA
// ----------------------------------------------------
const chainLinks = {
    insumos: {
        title: 'Fornecedores de insumos',
        participants: 'Empresas de sementes, fertilizantes, corretivos, defensivos, máquinas e assistência técnica.',
        value: 'Disponibilizam materiais, equipamentos e conhecimento para implantar e conduzir a lavoura.',
        risks: 'Variação de preços, dependência de importações, disponibilidade no período de plantio e uso inadequado dos produtos.',
        fact: 'Dado didático: 4 grupos frequentemente considerados no planejamento são sementes, fertilidade do solo, proteção da lavoura e máquinas/serviços.'
    },
    produtor: {
        title: 'Produtores rurais',
        participants: 'Agricultores, trabalhadores, cooperativas e profissionais de assistência técnica.',
        value: 'Transformam terra, trabalho, insumos e conhecimento em grãos; decisões de manejo afetam produtividade e qualidade.',
        risks: 'Clima, pragas e doenças, custo de crédito, preços, disponibilidade de armazenagem e risco de produção.',
        fact: 'Referência comercial: a saca de soja no Brasil costuma corresponder a 60 kg. Confirme a unidade e o padrão usados pela fonte de preço consultada.'
    },
    logistica: {
        title: 'Armazenamento e logística',
        participants: 'Silos, armazéns, transportadoras, operadores ferroviários, hidrovias, terminais e portos.',
        value: 'Conservam o grão e conectam regiões produtoras a indústrias, centros de consumo e portos.',
        risks: 'Distância, filas, perdas, falta de armazenagem próxima, condições de estrada e variação do frete.',
        fact: '3 modais comuns no escoamento são rodoviário, ferroviário e hidroviário. A participação muda conforme a rota e a safra.'
    },
    trading: {
        title: 'Tradings e comercialização',
        participants: 'Empresas exportadoras, cooperativas, corretoras, compradores e agentes do mercado físico e futuro.',
        value: 'Organizam compra, venda, financiamento, armazenagem, transporte e conexão com compradores globais.',
        risks: 'Variação de preços e câmbio, risco de crédito, contratos, concentração de compradores e custos logísticos.',
        fact: 'Referência de mercado: o contrato futuro padrão de soja da CBOT é de 5.000 bushels (aproximadamente 136 t). Confirme a especificação vigente no CME Group; não é o tamanho de toda venda física.'
    },
    exportacao: {
        title: 'Exportação do grão',
        participants: 'Exportadores, terminais portuários, autoridades aduaneiras, armadores e compradores internacionais.',
        value: 'Leva o grão a mercados externos como matéria-prima para processamento e alimentação animal.',
        risks: 'Demanda internacional, câmbio, capacidade de portos, frete marítimo, qualidade e exigências de rastreabilidade.',
        fact: 'Unidade de referência: 1 tonelada equivale a 1.000 kg de grãos. A quantidade exportada por país e safra deve ser conferida em dados atuais da Comex Stat ou Conab.'
    },
    industria: {
        title: 'Indústria de esmagamento',
        participants: 'Esmagadoras, refinarias, fabricantes de ração, indústrias de alimentos e produtores de biodiesel.',
        value: 'Processa o grão para obter óleo e farelo, que abastecem mercados de alimentos, ração e energia.',
        risks: 'Custo de energia, capacidade ociosa, oferta de matéria-prima, demanda por coprodutos e preço relativo de óleo e farelo.',
        fact: 'Exemplo ilustrativo para 1.000 kg: cerca de 180 kg de óleo, 790 kg de farelo e 30 kg de outras frações. O rendimento depende do grão e do processo; conferir dados atuais da ABIOVE ou Embrapa.'
    }
};

let chainAnimationTimer = null;
let chainAnimationIndex = -1;

function showChainDetails(linkId) {
    const link = chainLinks[linkId];
    if (!link) return;

    document.querySelectorAll('[data-chain-link]').forEach(button => {
        const selected = button.dataset.chainLink === linkId;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
    });
    document.getElementById('chain-detail-title').textContent = link.title;
    document.getElementById('chain-participants').textContent = link.participants;
    document.getElementById('chain-value').textContent = link.value;
    document.getElementById('chain-risks').textContent = link.risks;
    document.getElementById('chain-fact').textContent = link.fact;
}

function updateChainFlow() {
    const sequence = ['insumos', 'produtor', 'logistica', 'trading', 'industria', 'exportacao'];
    document.querySelectorAll('[data-chain-link]').forEach(button => {
        button.classList.toggle('is-flowing', button.dataset.chainLink === sequence[chainAnimationIndex]);
    });
}

function stopChainAnimation() {
    if (chainAnimationTimer) window.clearInterval(chainAnimationTimer);
    chainAnimationTimer = null;
    chainAnimationIndex = -1;

    const module = document.getElementById('chain-module');
    const button = module?.querySelector('[data-chain-animation]');
    if (!module || !button) return;

    module.querySelector('.chain-diagram').classList.remove('is-flowing');
    module.querySelectorAll('[data-chain-link]').forEach(node => node.classList.remove('is-flowing'));
    button.setAttribute('aria-pressed', 'false');
    button.textContent = '▶ Animar fluxo do grão';
    document.getElementById('chain-flow-status').textContent = 'Fluxo do grão pausado.';
}

function toggleChainAnimation(button) {
    if (chainAnimationTimer) {
        stopChainAnimation();
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('chain-flow-status').textContent = 'A animação está desativada pela preferência de movimento reduzido do dispositivo.';
        return;
    }

    const diagram = document.getElementById('chain-diagram');
    diagram.classList.add('is-flowing');
    button.setAttribute('aria-pressed', 'true');
    button.textContent = '⏸ Pausar fluxo';
    document.getElementById('chain-flow-status').textContent = 'Fluxo do grão em movimento. Use o botão para pausar.';
    chainAnimationIndex = 0;
    updateChainFlow();
    chainAnimationTimer = window.setInterval(() => {
        chainAnimationIndex = (chainAnimationIndex + 1) % 6;
        updateChainFlow();
    }, 900);
}

function updateOneTonModel() {
    const exportSlider = document.getElementById('export-share');
    const biodieselSlider = document.getElementById('biodiesel-share');
    if (!exportSlider || !biodieselSlider) return;

    const exportShare = Number(exportSlider.value) / 100;
    const biodieselShare = Number(biodieselSlider.value) / 100;
    const totalKg = 1000;
    const exportKg = totalKg * exportShare;
    const crushedKg = totalKg - exportKg;
    const oilKg = crushedKg * 0.18;
    const mealKg = crushedKg * 0.79;
    const otherKg = crushedKg * 0.03;
    const oilForBiodieselKg = oilKg * biodieselShare;
    const oilForOtherUsesKg = oilKg - oilForBiodieselKg;
    const formatKg = value => `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} kg`;

    document.getElementById('export-share-value').textContent = `${exportSlider.value}%`;
    document.getElementById('biodiesel-share-value').textContent = `${biodieselSlider.value}%`;
    document.getElementById('ton-crushed-summary').textContent = `Neste cenário, ${formatKg(exportKg)} seguem para exportação in natura e ${formatKg(crushedKg)} para esmagamento.`;
    document.getElementById('routing-export-kg').textContent = formatKg(exportKg);
    document.getElementById('routing-crushing-kg').textContent = formatKg(crushedKg);
    document.getElementById('ton-export-kg').textContent = formatKg(exportKg);
    document.getElementById('ton-oil-kg').textContent = formatKg(oilKg);
    document.getElementById('ton-meal-kg').textContent = formatKg(mealKg);
    document.getElementById('ton-other-kg').textContent = formatKg(otherKg);
    document.getElementById('oil-biodiesel-kg').textContent = formatKg(oilForBiodieselKg);
    document.getElementById('oil-other-kg').textContent = formatKg(oilForOtherUsesKg);
    document.getElementById('ton-biodiesel-note').textContent = `Do óleo obtido, ${formatKg(oilForBiodieselKg)} seriam destinados ao biodiesel e ${formatKg(oilForOtherUsesKg)} a outros usos. Isso representa óleo encaminhado, não a massa final de biodiesel.`;

    const quantities = { export: exportKg, oil: oilKg, meal: mealKg, other: otherKg };
    Object.entries(quantities).forEach(([name, quantity]) => {
        const segment = document.querySelector(`[data-ton-segment="${name}"]`);
        segment.style.width = `${quantity / totalKg * 100}%`;
        segment.textContent = quantity / totalKg >= 0.12 ? `${name === 'export' ? 'Exportação' : name === 'meal' ? 'Farelo' : name === 'oil' ? 'Óleo' : 'Outros'}` : '';
    });

    const routingSegments = {
        export: { quantity: exportKg, label: 'Exportação in natura' },
        crushing: { quantity: crushedKg, label: 'Segue para esmagamento' }
    };
    Object.entries(routingSegments).forEach(([name, segmentData]) => {
        const segment = document.querySelector(`[data-routing-segment="${name}"]`);
        segment.style.width = `${segmentData.quantity / totalKg * 100}%`;
        segment.textContent = segmentData.quantity / totalKg >= 0.12 ? segmentData.label : '';
    });

    const oilUseSegments = {
        biodiesel: { share: biodieselShare, label: 'Biodiesel' },
        other: { share: 1 - biodieselShare, label: 'Outros usos' }
    };
    Object.entries(oilUseSegments).forEach(([name, segmentData]) => {
        const segment = document.querySelector(`[data-oil-use-segment="${name}"]`);
        segment.style.width = `${segmentData.share * 100}%`;
        segment.textContent = segmentData.share >= 0.12 ? segmentData.label : '';
    });

    document.getElementById('ton-routing-graph').setAttribute(
        'aria-label',
        `Destino inicial dos 1.000 kg: ${formatKg(exportKg)} para exportação in natura e ${formatKg(crushedKg)} para esmagamento.`
    );
    document.getElementById('ton-graph').setAttribute(
        'aria-label',
        `De 1.000 kg de grãos: ${formatKg(exportKg)} exportados, ${formatKg(oilKg)} de óleo, ${formatKg(mealKg)} de farelo e ${formatKg(otherKg)} de outras frações.`
    );
    document.getElementById('ton-oil-uses-graph').setAttribute(
        'aria-label',
        `Do óleo obtido, ${formatKg(oilForBiodieselKg)} seguem para biodiesel e ${formatKg(oilForOtherUsesKg)} para outros usos.`
    );
}

function initChainModule() {
    const module = document.getElementById('chain-module');
    if (!module) return;

    showChainDetails('insumos');
    updateOneTonModel();

    module.addEventListener('click', event => {
        const linkButton = event.target.closest('[data-chain-link]');
        if (linkButton) {
            stopChainAnimation();
            showChainDetails(linkButton.dataset.chainLink);
            return;
        }

        const animationButton = event.target.closest('[data-chain-animation]');
        if (animationButton) {
            toggleChainAnimation(animationButton);
            return;
        }

        const modeButton = event.target.closest('[data-ton-mode-toggle]');
        if (modeButton) {
            const mode = document.getElementById('one-ton-mode');
            const expanded = modeButton.getAttribute('aria-expanded') === 'true';
            modeButton.setAttribute('aria-expanded', String(!expanded));
            modeButton.textContent = expanded ? 'Explorar 1 tonelada' : 'Fechar simulador';
            mode.hidden = expanded;
            if (!expanded) updateOneTonModel();
        }
    });

    module.addEventListener('input', event => {
        if (event.target.matches('#export-share, #biodiesel-share')) updateOneTonModel();
    });
}

initChainModule();

// ----------------------------------------------------
// PÁGINA: CUSTOS DE PRODUÇÃO (Mapa Interativo Simulado)
// ----------------------------------------------------
const dadosRegionais = {
    mt: { nome: 'Mato Grosso (MT)', custo: 6800, prod: 60, preco: 125 },
    pr: { nome: 'Paraná (PR)', custo: 7200, prod: 65, preco: 130 },
    go: { nome: 'Goiás (GO)', custo: 6950, prod: 62, preco: 126 },
    rs: { nome: 'Rio Grande do Sul (RS)', custo: 7100, prod: 55, preco: 132 },
    ms: { nome: 'Mato Grosso do Sul (MS)', custo: 6850, prod: 58, preco: 124 },
    ba: { nome: 'Bahia (MATOPIBA)', custo: 7000, prod: 64, preco: 122 }
};

function showCusto(uf) {
    const info = dadosRegionais[uf];
    if (!info) return;

    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const costPerBag = info.custo / info.prod;
    const differencePerBag = info.preco - costPerBag;
    document.getElementById('estado-nome').textContent = info.nome;
    document.getElementById('val-custo-total').textContent = `${currency.format(info.custo)} / ha`;
    document.getElementById('val-prod').textContent = `${info.prod} sc / ha`;
    document.getElementById('val-custo-saca').textContent = currency.format(costPerBag);
    document.getElementById('val-preco').textContent = `${currency.format(info.preco)} / sc`;
    document.getElementById('val-margem').textContent = `${currency.format(differencePerBag)} / sc`;
    document.querySelectorAll('.map-region').forEach(region => {
        region.classList.toggle('is-selected', region.dataset.region === uf);
        region.setAttribute('aria-pressed', String(region.dataset.region === uf));
    });
}

function updateRegionalHeatmap() {
    const mode = document.querySelector('input[name="map-mode"]:checked')?.value || 'produtividade';
    const values = Object.values(dadosRegionais).map(region => mode === 'custo' ? region.custo : region.prod);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const heatColors = ['#d7e8b8', '#a9cf87', '#78b461', '#468b4c', '#1b5e35'];

    document.querySelectorAll('.brazil-state[data-state]').forEach(state => {
        state.setAttribute('d', brazilStatePaths[state.dataset.state] || '');
    });

    document.querySelectorAll('.map-region').forEach(regionElement => {
        const region = dadosRegionais[regionElement.dataset.region];
        const value = mode === 'custo' ? region.custo : region.prod;
        const normalized = maximum === minimum ? 0 : (value - minimum) / (maximum - minimum);
        const colorIndex = Math.round(normalized * (heatColors.length - 1));
        regionElement.style.setProperty('--heat-color', heatColors[colorIndex]);
        regionElement.setAttribute('aria-label', `${region.nome}: custo ilustrativo de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(region.custo)} por hectare e produtividade de ${region.prod} sacas por hectare`);
    });
}

function renderRegionComparison() {
    const selectA = document.getElementById('region-compare-a');
    const selectB = document.getElementById('region-compare-b');
    const results = document.getElementById('region-comparison-results');
    if (!selectA || !selectB || !results) return;

    const regionIds = [selectA.value, selectB.value];
    if (regionIds[0] === regionIds[1]) {
        results.textContent = 'Escolha duas regiões diferentes para comparar.';
        return;
    }

    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    results.innerHTML = regionIds.map(regionId => {
        const region = dadosRegionais[regionId];
        return `<article class="region-comparison-card">
            <h4>${region.nome}</h4>
            <dl>
                <div><dt>Custo ilustrativo</dt><dd>${currency.format(region.custo)} / ha</dd></div>
                <div><dt>Produtividade</dt><dd>${region.prod} sc / ha</dd></div>
                <div><dt>Custo por saca</dt><dd>${currency.format(region.custo / region.prod)}</dd></div>
                <div><dt>Preço de referência</dt><dd>${currency.format(region.preco)} / sc</dd></div>
            </dl>
        </article>`;
    }).join('');
}

const costCategories = [
    { id: 'fertilizer', label: 'Fertilizantes', color: '#2e7d32', baseShare: 0 },
    { id: 'pesticides', label: 'Defensivos', color: '#8b6f47', baseShare: 28 },
    { id: 'seeds', label: 'Sementes', color: '#d6a33a', baseShare: 14 },
    { id: 'operations', label: 'Operações e máquinas', color: '#5b8ca8', baseShare: 12 },
    { id: 'fuel', label: 'Combustível', color: '#bc6c3d', baseShare: 8 },
    { id: 'other', label: 'Outros', color: '#7c8d67', baseShare: 6 }
];

function updateCostDonut(fertilizerCost, otherCosts, totalCost) {
    const nonFertilizerShare = costCategories.slice(1).reduce((total, category) => total + category.baseShare, 0);
    const categoryValues = costCategories.map(category => ({
        ...category,
        value: category.id === 'fertilizer' ? fertilizerCost : otherCosts * category.baseShare / nonFertilizerShare
    }));
    let currentAngle = 0;
    const segments = categoryValues.map(category => {
        const endAngle = currentAngle + category.value / totalCost * 360;
        const segment = `${category.color} ${currentAngle}deg ${endAngle}deg`;
        currentAngle = endAngle;
        return segment;
    });
    const donut = document.getElementById('cost-donut');
    donut.style.background = `conic-gradient(${segments.join(', ')})`;
    document.getElementById('cost-donut-center').textContent = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL', maximumFractionDigits: 0
    }).format(totalCost);

    const legend = document.getElementById('cost-donut-legend');
    legend.replaceChildren(...categoryValues.map(category => {
        const item = document.createElement('li');
        const swatch = document.createElement('span');
        const label = document.createElement('span');
        const value = document.createElement('strong');
        swatch.className = 'cost-donut-swatch';
        swatch.style.backgroundColor = category.color;
        swatch.setAttribute('aria-hidden', 'true');
        label.textContent = category.label;
        value.textContent = `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(category.value / totalCost * 100)}%`;
        item.append(swatch, label, value);
        return item;
    }));
}

function updateFarmSimulator() {
    const yieldValue = Number(document.getElementById('farm-yield').value);
    const bagPrice = Number(document.getElementById('farm-price').value);
    const exchangeRate = Number(document.getElementById('farm-exchange').value);
    const baseFertilizerCost = Number(document.getElementById('farm-fertilizer').value);
    const area = Number(document.getElementById('farm-area').value);
    const baseExchangeRate = 5.5;
    const otherCosts = 4600;
    const fertilizerCost = baseFertilizerCost * exchangeRate / baseExchangeRate;
    const totalCost = fertilizerCost + otherCosts;
    const revenue = yieldValue * bagPrice;
    const margin = revenue - totalCost;
    const breakEvenPrice = totalCost / yieldValue;
    const totalResult = margin * area;
    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const currencyPerHa = value => `${currency.format(value)} / ha`;

    document.getElementById('farm-yield-value').textContent = `${yieldValue} sc/ha`;
    document.getElementById('farm-price-value').textContent = `${currency.format(bagPrice)} / sc`;
    document.getElementById('farm-exchange-value').textContent = `${currency.format(exchangeRate)} / US$`;
    document.getElementById('farm-fertilizer-value').textContent = `${currency.format(baseFertilizerCost)} / ha`;
    document.getElementById('farm-area-value').textContent = `${new Intl.NumberFormat('pt-BR').format(area)} ha`;
    document.getElementById('sim-cost-per-bag').textContent = currency.format(totalCost / yieldValue);
    document.getElementById('sim-break-even').textContent = `${currency.format(breakEvenPrice)} / sc`;
    document.getElementById('sim-margin-per-ha').textContent = currencyPerHa(margin);
    document.getElementById('sim-total-result').textContent = currency.format(totalResult);
    document.getElementById('sim-revenue-value').textContent = currencyPerHa(revenue);
    document.getElementById('sim-cost-value').textContent = currencyPerHa(totalCost);
    document.getElementById('sim-margin-value').textContent = currencyPerHa(margin);

    const graphMaximum = Math.max(revenue, totalCost, Math.abs(margin), 1);
    document.querySelector('[data-profit-bar="revenue"]').style.width = `${revenue / graphMaximum * 100}%`;
    document.querySelector('[data-profit-bar="cost"]').style.width = `${totalCost / graphMaximum * 100}%`;
    const marginBar = document.querySelector('[data-profit-bar="margin"]');
    marginBar.style.width = `${Math.abs(margin) / graphMaximum * 100}%`;
    marginBar.classList.toggle('is-negative', margin < 0);
    document.getElementById('profit-graph').setAttribute('aria-label', `Por hectare: receita ${currency.format(revenue)}, custo ${currency.format(totalCost)} e margem ${currency.format(margin)}.`);

    const lowerExchange = exchangeRate * 0.9;
    const lowerFertilizerCost = baseFertilizerCost * lowerExchange / baseExchangeRate;
    const lowerTotalCost = lowerFertilizerCost + otherCosts;
    const lowerMargin = revenue - lowerTotalCost;
    const fertilizerChange = fertilizerCost - lowerFertilizerCost;
    document.getElementById('exchange-scenario').textContent = `E se o dólar cair 10%? Mantendo o preço da soja e as demais premissas, este modelo reduziria o custo estimado de fertilizantes em ${currency.format(fertilizerChange)} / ha e elevaria a margem estimada para ${currencyPerHa(lowerMargin)}. É uma simplificação: contratos, proteção cambial e outros custos podem mudar o resultado real.`;

    updateCostDonut(fertilizerCost, otherCosts, totalCost);
}

function initCostSimulator() {
    document.querySelectorAll('.sim-control input').forEach(input => {
        input.addEventListener('input', updateFarmSimulator);
    });
    document.querySelectorAll('input[name="map-mode"]').forEach(input => {
        input.addEventListener('change', updateRegionalHeatmap);
    });
    document.querySelectorAll('.map-region').forEach(region => {
        region.addEventListener('click', () => showCusto(region.dataset.region));
        region.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showCusto(region.dataset.region);
            }
        });
    });
    ['region-compare-a', 'region-compare-b'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderRegionComparison);
    });

    updateRegionalHeatmap();
    showCusto('mt');
    renderRegionComparison();
    updateFarmSimulator();
}

function updateMarketGame() {
    const activeFactors = [...document.querySelectorAll('[data-market-factor]:checked')].map(input => input.dataset.marketFactor);
    const internationalFactors = activeFactors.filter(factor => factor === 'climate' || factor === 'demand');
    const exchangeActive = activeFactors.includes('exchange');
    const output = document.getElementById('market-game-result');
    if (!output) return;

    if (activeFactors.length === 0) {
        output.textContent = 'Ative um ou mais cenários para comparar os possíveis efeitos sobre preço internacional e valor em reais.';
        return;
    }

    const internationalEffect = internationalFactors.length === 2
        ? 'Clima e demanda atuam na direção de uma possível pressão de alta sobre a referência internacional.'
        : internationalFactors.length === 1
            ? 'O cenário selecionado pode pressionar a referência internacional para cima, se os demais fatores não compensarem esse efeito.'
            : 'Sem um choque de oferta ou demanda selecionado, não há neste exercício um sinal direto para a cotação internacional.';
    const exchangeEffect = exchangeActive
        ? 'Com dólar mais alto, uma mesma receita em dólares pode se converter em mais reais; isso não garante maior lucro e não eleva automaticamente a cotação da CBOT.'
        : 'Nenhum cenário cambial foi selecionado.';
    output.textContent = `${internationalEffect} ${exchangeEffect}`;
}

function initMarketGame() {
    document.querySelectorAll('[data-market-factor]').forEach(input => {
        input.addEventListener('change', updateMarketGame);
    });
}

function renderFarmBuilder() {
    const sizeInput = document.getElementById('farm-builder-size');
    const budgetInput = document.getElementById('farm-builder-budget');
    if (!sizeInput || !budgetInput) return;

    const area = Number(sizeInput.value);
    const budget = Number(budgetInput.value);
    const selectedTechnologies = [...document.querySelectorAll('[data-farm-tech]:checked')];
    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const investment = selectedTechnologies.reduce((sum, technology) => {
        return sum + Number(technology.dataset.costFixed) + Number(technology.dataset.costPerHa) * area;
    }, 0);
    const annualBenefit = selectedTechnologies.reduce((sum, technology) => {
        return sum + Number(technology.dataset.benefitPerHa) * area;
    }, 0);
    const remainingBudget = budget - investment;
    const payback = annualBenefit > 0 ? investment / annualBenefit : null;

    document.getElementById('farm-builder-size-value').textContent = `${new Intl.NumberFormat('pt-BR').format(area)} ha`;
    document.getElementById('farm-builder-budget-value').textContent = currency.format(budget);
    document.getElementById('farm-builder-investment').textContent = currency.format(investment);
    document.getElementById('farm-builder-benefit').textContent = `${currency.format(annualBenefit)} / ano`;
    document.getElementById('farm-builder-payback').textContent = payback === null
        ? 'Não monetizado'
        : payback === 0
            ? 'Sem investimento estimado'
            : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(payback)} anos`;
    document.getElementById('farm-builder-remaining').textContent = `${currency.format(remainingBudget)} ${remainingBudget < 0 ? 'acima do orçamento' : 'disponíveis'}`;

    const status = document.getElementById('farm-builder-status');
    status.classList.toggle('is-over-budget', remainingBudget < 0);
    if (selectedTechnologies.length === 0) {
        status.textContent = 'Selecione ao menos uma tecnologia para montar o cenário.';
    } else if (remainingBudget < 0) {
        status.textContent = `O investimento estimado ultrapassa o orçamento em ${currency.format(Math.abs(remainingBudget))}.`;
    } else {
        status.textContent = `O cenário cabe no orçamento, com ${currency.format(remainingBudget)} restantes.`;
    }

    const selectionList = document.getElementById('farm-builder-selection');
    selectionList.replaceChildren(...selectedTechnologies.map(technology => {
        const item = document.createElement('li');
        const label = technology.closest('.farm-tech-option').querySelector('strong').textContent;
        const techInvestment = Number(technology.dataset.costFixed) + Number(technology.dataset.costPerHa) * area;
        const techBenefit = Number(technology.dataset.benefitPerHa) * area;
        item.textContent = `${label}: ${currency.format(techInvestment)} iniciais; benefício hipotético de ${currency.format(techBenefit)} / ano.`;
        return item;
    }));
}

function filterTechnologyTable() {
    const table = document.getElementById('technology-table');
    if (!table) return;

    const query = document.getElementById('tec-filter-text').value.trim().toLocaleLowerCase('pt-BR');
    const filters = {
        cost: document.getElementById('tec-filter-cost').value,
        benefit: document.getElementById('tec-filter-benefit').value,
        access: document.getElementById('tec-filter-access').value
    };
    const rows = [...table.tBodies[0].rows];
    let visibleCount = 0;

    rows.forEach(row => {
        const matchesText = row.textContent.toLocaleLowerCase('pt-BR').includes(query);
        const matchesFilters = Object.entries(filters).every(([key, value]) => !value || row.dataset[`tech${key[0].toUpperCase()}${key.slice(1)}`] === value);
        row.hidden = !(matchesText && matchesFilters);
        if (!row.hidden) visibleCount += 1;
    });

    document.getElementById('tec-filter-count').textContent = `${visibleCount} de ${rows.length} tecnologias`;
}

function sortTechnologyTable(button) {
    const table = document.getElementById('technology-table');
    const key = button.dataset.techSort;
    const headers = [...table.tHead.rows[0].cells];
    const header = button.closest('th');
    const ascending = header.getAttribute('aria-sort') !== 'ascending';
    const direction = ascending ? 1 : -1;
    const ranks = { low: 1, medium: 2, high: 3 };
    const sortValue = row => {
        if (key === 'name') return row.cells[0].textContent.trim();
        return ranks[row.dataset[`tech${key[0].toUpperCase()}${key.slice(1)}`]] || 0;
    };
    const rows = [...table.tBodies[0].rows].sort((first, second) => {
        const firstValue = sortValue(first);
        const secondValue = sortValue(second);
        if (typeof firstValue === 'string') return firstValue.localeCompare(secondValue, 'pt-BR') * direction;
        return (firstValue - secondValue) * direction;
    });

    rows.forEach(row => table.tBodies[0].appendChild(row));
    headers.forEach(cell => cell.setAttribute('aria-sort', 'none'));
    header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    button.dataset.sortDirection = ascending ? 'ascending' : 'descending';
    filterTechnologyTable();
}

function initTechnologyModule() {
    const builder = document.getElementById('farm-builder');
    if (!builder) return;

    builder.querySelectorAll('input[type="range"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('input', renderFarmBuilder);
        input.addEventListener('change', renderFarmBuilder);
    });
    document.getElementById('tec-filter-text').addEventListener('input', filterTechnologyTable);
    ['tec-filter-cost', 'tec-filter-benefit', 'tec-filter-access'].forEach(id => {
        document.getElementById(id).addEventListener('change', filterTechnologyTable);
    });
    document.querySelectorAll('[data-tech-sort]').forEach(button => {
        button.addEventListener('click', () => sortTechnologyTable(button));
    });

    renderFarmBuilder();
    filterTechnologyTable();
}

const sustainabilityPractices = {
    spd: { name: 'Plantio direto', ods: ['2', '12', '13', '15'] },
    fbn: { name: 'Fixação biológica de nitrogênio', ods: ['2', '12', '13'] },
    bioinsumos: { name: 'Manejo integrado e bioinsumos', ods: ['2', '12', '15'] },
    ilpf: { name: 'Integração lavoura-pecuária-floresta', ods: ['2', '13', '15'] }
};

const sustainabilityOds = {
    '2': 'Fome Zero e Agricultura Sustentável',
    '12': 'Consumo e Produção Responsáveis',
    '13': 'Ação Contra a Mudança do Clima',
    '15': 'Vida Terrestre'
};

function setSustainabilityTab(activeTab) {
    const tabs = [...document.querySelectorAll('.sustainability-tab')];
    tabs.forEach(tab => {
        const selected = tab === activeTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.classList.toggle('is-active', selected);
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
    });
}

function updatePracticeOdsMap(selectionType, selectionId) {
    const relatedPracticeIds = selectionType === 'practice'
        ? [selectionId]
        : Object.keys(sustainabilityPractices).filter(practiceId => sustainabilityPractices[practiceId].ods.includes(selectionId));
    const relatedOdsIds = selectionType === 'practice'
        ? sustainabilityPractices[selectionId].ods
        : [selectionId];

    document.querySelectorAll('[data-sustainability-practice]').forEach(button => {
        const practiceId = button.dataset.sustainabilityPractice;
        const selected = selectionType === 'practice' && practiceId === selectionId;
        const related = relatedPracticeIds.includes(practiceId);
        button.classList.toggle('is-selected', selected);
        button.classList.toggle('is-connected', related);
        button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-sustainability-ods]').forEach(button => {
        const odsId = button.dataset.sustainabilityOds;
        const selected = selectionType === 'ods' && odsId === selectionId;
        const related = relatedOdsIds.includes(odsId);
        button.classList.toggle('is-selected', selected);
        button.classList.toggle('is-connected', related);
        button.setAttribute('aria-pressed', String(selected));
    });

    const status = document.getElementById('practice-ods-status');
    if (selectionType === 'practice') {
        const odsList = sustainabilityPractices[selectionId].ods.map(odsId => `ODS ${odsId}`).join(', ');
        status.textContent = `${sustainabilityPractices[selectionId].name}: contribuições possíveis aos ${odsList}. As conexões dependem de como a prática é aplicada.`;
    } else {
        const practices = relatedPracticeIds.map(practiceId => sustainabilityPractices[practiceId].name).join('; ');
        status.textContent = `ODS ${selectionId} — ${sustainabilityOds[selectionId]}. Práticas relacionadas neste mapa: ${practices}. A relação depende do contexto e dos resultados da adoção.`;
    }
}

function updateSustainabilityComparator() {
    const slider = document.getElementById('sustainability-comparison-slider');
    if (!slider) return;

    const level = Number(slider.value);
    const output = document.getElementById('sustainability-comparison-value');
    const fill = document.getElementById('sustainability-comparison-fill');
    const status = document.getElementById('sustainability-comparison-status');
    output.textContent = `${level}% selecionado`;
    slider.setAttribute('aria-valuetext', `${level}% do conjunto didático de práticas`);
    fill.style.width = `${level}%`;

    const referenceState = document.querySelector('[data-comparison-state="reference"]');
    const regenerativeState = document.querySelector('[data-comparison-state="regenerative"]');
    referenceState.classList.toggle('is-active', level < 100);
    regenerativeState.classList.toggle('is-active', level > 0);

    if (level === 0) {
        status.textContent = 'Referência didática: sem o conjunto de práticas selecionado neste comparador.';
    } else if (level === 100) {
        status.textContent = 'Cenário didático: o conjunto de práticas regenerativas apresentado está selecionado. Os resultados variam por local e manejo.';
    } else {
        status.textContent = `Transição didática: nível ${level} do controle. Esse valor não mede a adoção real nem quantifica impactos.`;
    }
}

function initSustainabilityModule() {
    const tabs = [...document.querySelectorAll('.sustainability-tab')];
    if (tabs.length === 0) return;

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => setSustainabilityTab(tab));
        tab.addEventListener('keydown', event => {
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = tabs.length - 1;
            else return;

            event.preventDefault();
            tabs[nextIndex].focus();
            setSustainabilityTab(tabs[nextIndex]);
        });
    });

    document.querySelectorAll('[data-sustainability-practice]').forEach(button => {
        button.addEventListener('click', () => updatePracticeOdsMap('practice', button.dataset.sustainabilityPractice));
    });
    document.querySelectorAll('[data-sustainability-ods]').forEach(button => {
        button.addEventListener('click', () => updatePracticeOdsMap('ods', button.dataset.sustainabilityOds));
    });
    document.getElementById('sustainability-comparison-slider').addEventListener('input', updateSustainabilityComparator);

    updatePracticeOdsMap('practice', 'spd');
    updateSustainabilityComparator();
}

initTechnologyModule();
initSustainabilityModule();
initCostSimulator();
initMarketGame();

// ----------------------------------------------------
// MÓDULO: DO CAMPO À MESA
// ----------------------------------------------------
const cycleStages = [
    {
        id: 'solo', icon: '🌱', title: 'Preparo do solo e calagem', art: 'soil',
        duration: 'Semanas antes do plantio',
        successionDuration: 'Semanas antes do plantio da soja',
        happens: 'O produtor avalia o solo e, quando a análise recomenda, aplica calcário para corrigir a acidez. Em sistemas conservacionistas, a palhada protege a superfície.',
        matters: 'Um solo bem manejado ajuda as raízes a acessar água e nutrientes e reduz perdas por erosão. A necessidade de calagem depende de análise, não de uma receita única.',
        question: 'Qual ferramenta ajuda a decidir se é necessário aplicar calcário?',
        options: ['Análise do solo', 'Cor do trator'], answer: 0,
        feedback: 'A análise do solo orienta a correção da acidez e a quantidade de calcário para cada área.',
        impactPage: 'sustentabilidade', impactLabel: 'Meio ambiente e ODS'
    },
    {
        id: 'semeadura', icon: '🚜', title: 'Semeadura e inoculação', art: 'sowing',
        duration: 'Operação de poucos dias; calendário varia por região',
        successionDuration: 'Plantio de verão planejado para a janela local da soja',
        happens: 'A plantadeira distribui as sementes. A inoculação adiciona bactérias benéficas, como Bradyrhizobium, que podem formar nódulos nas raízes.',
        matters: 'Essas bactérias capturam nitrogênio do ar e o tornam disponível à planta. A inoculação precisa ser feita e armazenada conforme orientação técnica.',
        question: 'O que as bactérias usadas na inoculação ajudam a fazer?',
        options: ['Fixar nitrogênio do ar', 'Aumentar a salinidade do solo'], answer: 0,
        feedback: 'A fixação biológica de nitrogênio (FBN) é uma parceria entre a planta e microrganismos que reduz a dependência de adubos nitrogenados.',
        impactPage: 'custos', impactLabel: 'Custos de produção'
    },
    {
        id: 'desenvolvimento', icon: '🌿', title: 'Desenvolvimento: estágios V e R', art: 'growth',
        duration: 'Em geral, cerca de 3 a 5 meses do plantio à colheita',
        successionDuration: 'Em geral, cerca de 3 a 5 meses; depende da cultivar e da região',
        happens: 'Nos estágios V, a planta forma folhas e nós. Nos estágios R, floresce e desenvolve vagens e grãos. A duração muda conforme cultivar e condições locais.',
        matters: 'Entender o estágio ajuda a programar avaliações e operações no momento adequado, sem tratar toda a lavoura como se estivesse na mesma fase.',
        question: 'O que caracteriza os estágios R da soja?',
        options: ['Florescimento e formação de vagens e grãos', 'Apenas o preparo do solo'], answer: 0,
        feedback: 'Os estágios reprodutivos (R) incluem floração, formação de vagens e enchimento dos grãos.',
        impactPage: 'tecnologia', impactLabel: 'Tecnologia no campo'
    },
    {
        id: 'manejo', icon: '🔎', title: 'Manejo de pragas e doenças', art: 'management',
        duration: 'Acompanhamento durante todo o ciclo',
        successionDuration: 'Acompanhamento durante o ciclo; atenção à janela de colheita',
        happens: 'A lavoura é monitorada para identificar plantas daninhas, insetos e doenças. A ferrugem asiática é uma doença causada por fungo e exige manejo preventivo e acompanhamento técnico.',
        matters: 'Monitorar antes de decidir permite escolher medidas adequadas e reduzir perdas. Produto, dose e momento de aplicação devem seguir orientação profissional e rótulo.',
        question: 'A ferrugem asiática da soja é causada por quê?',
        options: ['Um fungo', 'Falta de colheitadeira'], answer: 0,
        feedback: 'A ferrugem asiática é uma doença fúngica. O monitoramento e as estratégias de manejo recomendadas localmente são fundamentais.',
        impactPage: 'sustentabilidade', impactLabel: 'Manejo e sustentabilidade'
    },
    {
        id: 'colheita', icon: '🌾', title: 'Colheita', art: 'harvest',
        duration: 'Dias a algumas semanas, conforme área e clima',
        successionDuration: 'Colheita planejada para liberar a área ao milho safrinha',
        happens: 'A colheitadeira corta as plantas, separa os grãos e devolve parte dos resíduos ao campo. O ponto de colheita depende da maturação e das condições do grão.',
        matters: 'Perdas na colheita reduzem a quantidade comercializada. Na sucessão, o calendário também influencia a janela disponível para semear o milho.',
        question: 'Na sucessão soja–milho, por que o calendário da colheita importa?',
        options: ['Ajuda a definir a janela para semear o milho', 'Determina a cotação na bolsa de Chicago'], answer: 0,
        feedback: 'Colher no momento adequado ajuda a preservar a qualidade e pode dar mais tempo para a semeadura do milho de segunda safra.',
        impactPage: 'custos', impactLabel: 'Custos e produtividade'
    },
    {
        id: 'armazenagem', icon: '🏚️', title: 'Secagem e armazenagem', art: 'storage',
        duration: 'Logo após a colheita; manejo contínuo no silo',
        successionDuration: 'Logo após a colheita, antes do transporte ou processamento',
        happens: 'Os grãos podem ser limpos e secos até condições seguras para conservação. Depois, ficam em silos ou outros armazéns até serem vendidos ou processados.',
        matters: 'Umidade, temperatura e impurezas precisam ser monitoradas para evitar deterioração e preservar a qualidade do lote.',
        question: 'Por que monitorar a umidade durante a armazenagem?',
        options: ['Para reduzir o risco de deterioração', 'Para mudar a variedade do grão'], answer: 0,
        feedback: 'Controlar as condições do grão ajuda a conservar a qualidade e diminui perdas durante o armazenamento.',
        impactPage: 'custos', impactLabel: 'Custos e logística'
    },
    {
        id: 'transporte', icon: '🚛', title: 'Transporte', art: 'transport',
        duration: 'Horas a dias; depende da distância e da rota',
        successionDuration: 'Horas a dias; depende da distância e da rota',
        happens: 'Caminhões, trens ou barcaças levam os grãos de fazendas e armazéns a indústrias, centros de distribuição e portos.',
        matters: 'Distância, infraestrutura, disponibilidade de armazéns e custo do frete influenciam a renda recebida pelo produtor e o preço ao comprador.',
        question: 'O que pode aumentar o custo para levar a soja até o destino?',
        options: ['Distância e gargalos logísticos', 'A cor dos grãos'], answer: 0,
        feedback: 'Distância, condições das rotas e capacidade de transporte são fatores importantes no custo logístico.',
        impactPage: 'cadeia', impactLabel: 'Cadeia produtiva'
    },
    {
        id: 'esmagamento', icon: '⚙️', title: 'Esmagamento e processamento', art: 'processing',
        duration: 'Processo industrial contínuo; varia por unidade',
        successionDuration: 'Processo industrial contínuo; varia por unidade',
        happens: 'Na indústria, o grão é preparado e processado para obter principalmente óleo e farelo. A lecitina pode ser separada durante o processamento do óleo.',
        matters: 'O processamento cria produtos diferentes a partir de uma mesma matéria-prima e conecta a produção rural a vários setores da economia.',
        question: 'Quais são dois produtos principais do esmagamento da soja?',
        options: ['Óleo e farelo', 'Açúcar e algodão'], answer: 0,
        feedback: 'O esmagamento produz principalmente óleo e farelo; a lecitina também pode ser obtida no processamento do óleo.',
        impactPage: 'cadeia', impactLabel: 'Indústria e cadeia produtiva'
    },
    {
        id: 'destinos', icon: '🍽️', title: 'Biodiesel, ração e alimentos', art: 'table',
        duration: 'Distribuição em dias ou semanas; varia por destino',
        successionDuration: 'Distribuição em dias ou semanas; varia por destino',
        happens: 'O farelo é usado principalmente em rações. O óleo pode seguir para alimentos e biodiesel. Derivados da soja também são ingredientes de diversos produtos.',
        matters: 'O destino final liga a lavoura à alimentação humana e animal, à indústria e à energia. A proporção destinada a cada uso varia com o mercado.',
        question: 'Qual produto da soja é muito usado como fonte de proteína em rações?',
        options: ['Farelo', 'Casca de arroz'], answer: 0,
        feedback: 'O farelo de soja é um ingrediente importante de rações, especialmente por seu teor de proteína.',
        impactPage: 'mercado', impactLabel: 'Mercado e usos da soja'
    }
];

function renderCycleStages() {
    const timeline = document.getElementById('cycle-timeline');
    if (!timeline) return;

    timeline.innerHTML = cycleStages.map((stage, index) => `
        <li class="cycle-item">
            <article class="cycle-card" aria-labelledby="cycle-stage-${stage.id}">
                <div class="cycle-card-topline">
                    <span class="cycle-step-number">Etapa ${String(index + 1).padStart(2, '0')}</span>
                    <span class="cycle-stage-icon" aria-hidden="true">${stage.icon}</span>
                </div>
                <div class="cycle-art cycle-art--${stage.art}" aria-hidden="true">
                    <span class="cycle-art-sun"></span>
                    <span class="cycle-art-ground"></span>
                    <span class="cycle-art-object"></span>
                </div>
                <h3 id="cycle-stage-${stage.id}">${stage.title}</h3>
                <p class="cycle-duration"><strong>Duração aproximada</strong><span data-stage-duration="${stage.id}">${stage.duration}</span></p>
                <div class="cycle-explanation">
                    <p><strong>O que acontece</strong>${stage.happens}</p>
                    <p><strong>Por que importa</strong>${stage.matters}</p>
                </div>
                <div class="cycle-challenge" role="group" aria-labelledby="challenge-${stage.id}">
                    <p id="challenge-${stage.id}" class="cycle-challenge-question">Desafio: ${stage.question}</p>
                    <div class="cycle-challenge-options">
                        ${stage.options.map((option, optionIndex) => `<button class="cycle-answer" type="button" data-cycle-stage="${stage.id}" data-cycle-answer="${optionIndex}">${option}</button>`).join('')}
                    </div>
                    <p class="cycle-feedback" id="feedback-${stage.id}" role="status" aria-live="polite" hidden></p>
                </div>
                <button class="cycle-impact" type="button" data-page-link="${stage.impactPage}">
                    <span>Ver impacto econômico/ambiental</span>
                    <span class="cycle-impact-destination">${stage.impactLabel} <span aria-hidden="true">→</span></span>
                </button>
            </article>
        </li>
    `).join('');
}

function updateCycleSeason(season) {
    const context = document.getElementById('season-context');
    if (!context) return;

    const succession = season === 'sucessao';
    context.textContent = succession
        ? 'Na sucessão, a soja é cultivada na safra principal e pode ser seguida pelo milho de segunda safra. A viabilidade depende do calendário, do clima e da região; “safrinha” se refere ao milho, não a uma segunda soja.'
        : 'A soja de verão é cultivada na safra principal. A época de semeadura muda conforme a região e deve respeitar o calendário agrícola e o zoneamento vigentes.';

    cycleStages.forEach(stage => {
        const duration = document.querySelector(`[data-stage-duration="${stage.id}"]`);
        if (duration) duration.textContent = succession ? stage.successionDuration : stage.duration;
    });
}

function answerCycleChallenge(button) {
    const stage = cycleStages.find(item => item.id === button.dataset.cycleStage);
    if (!stage) return;

    const answers = document.querySelectorAll(`[data-cycle-stage="${stage.id}"]`);
    if ([...answers].some(answer => answer.disabled)) return;

    const isCorrect = Number(button.dataset.cycleAnswer) === stage.answer;
    answers.forEach(answer => {
        answer.disabled = true;
        if (Number(answer.dataset.cycleAnswer) === stage.answer) answer.classList.add('is-correct');
    });
    if (!isCorrect) button.classList.add('is-incorrect');

    const feedback = document.getElementById(`feedback-${stage.id}`);
    feedback.textContent = `${isCorrect ? 'Correto.' : 'Quase. Reveja:'} ${stage.feedback}`;
    feedback.hidden = false;
    feedback.classList.toggle('is-correct', isCorrect);
    feedback.classList.toggle('is-incorrect', !isCorrect);
}

function initCycleModule() {
    renderCycleStages();
    updateCycleSeason(document.querySelector('input[name="season-mode"]:checked')?.value || 'verao');

    document.addEventListener('click', event => {
        const pageLink = event.target.closest('[data-page-link]');
        if (pageLink) {
            event.preventDefault();
            navigate(pageLink.dataset.pageLink);
            return;
        }

        const answerButton = event.target.closest('[data-cycle-answer]');
        if (answerButton) answerCycleChallenge(answerButton);
    });

    document.addEventListener('change', event => {
        if (event.target.matches('input[name="season-mode"]')) {
            updateCycleSeason(event.target.value);
        }
    });

    document.addEventListener('keydown', event => {
        const featureLink = event.target.closest('.feature-card[data-page-link]');
        if (featureLink && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            navigate(featureLink.dataset.pageLink);
        }
    });
}

initCycleModule();

// ----------------------------------------------------
// PÁGINA: QUIZ EDUCATIVO DE FIXAÇÃO
// ----------------------------------------------------
const quizQuestions = [
    { category: 'Mercado', difficulty: 'facil', question: 'Onde é negociada a principal referência internacional de contratos futuros de soja?', options: ['Bolsa de Metais de Londres (LME)', 'Bolsa de Mercadorias de Chicago (CBOT)', 'Bolsa de Valores de Tóquio (TSE)', 'Bolsa de Valores de Xangai (SSE)'], correctIndex: 1, explanation: 'A Chicago Board of Trade (CBOT), parte do CME Group, é uma referência importante para contratos futuros de soja. O preço local também depende de câmbio, frete, prêmio e condições regionais.', reviewPage: 'mercado' },
    { category: 'Unidades', difficulty: 'facil', question: 'No comércio brasileiro de soja, uma saca corresponde normalmente a quantos quilos?', options: ['50 kg', '100 kg', '60 kg', '120 kg'], correctIndex: 2, explanation: 'A saca comercial de soja no Brasil é normalmente considerada como 60 kg. Sempre confira a unidade da fonte consultada antes de comparar preços e produtividade.', reviewPage: 'custos' },
    { category: 'Cadeia produtiva', difficulty: 'facil', question: 'Qual é um dos principais destinos do farelo obtido no processamento da soja?', options: ['Fabricação de cimento e materiais de construção', 'Alimentação de aves, suínos e bovinos', 'Produção de combustível de aviação sem refino', 'Extração de sal e minerais para a indústria'], correctIndex: 1, explanation: 'O farelo é rico em proteína e é usado principalmente em rações para aves, suínos e outros animais. Sua composição e uso variam conforme a formulação da ração.', reviewPage: 'cadeia' },
    { category: 'Processamento', difficulty: 'facil', question: 'Quais são dois produtos principais do esmagamento industrial do grão?', options: ['Açúcar refinado e fibra de algodão', 'Etanol de milho e celulose de eucalipto', 'Farinha de trigo e amido de milho', 'Óleo de soja e farelo rico em proteína'], correctIndex: 3, explanation: 'O esmagamento separa principalmente óleo e farelo. Também podem ser obtidos outros componentes, como lecitina, e os rendimentos dependem do grão e do processo.', reviewPage: 'cadeia' },
    { category: 'Solo e nutrição', difficulty: 'facil', question: 'O que as bactérias usadas na inoculação da soja ajudam a fazer?', options: ['Substituir todos os nutrientes que o solo fornece', 'Fixar nitrogênio do ar em associação com a planta de soja', 'Dispensar a análise de solo antes do plantio', 'Produzir água para a lavoura em períodos secos'], correctIndex: 1, explanation: 'Na fixação biológica de nitrogênio (FBN), bactérias compatíveis formam uma associação com a soja e ajudam a disponibilizar nitrogênio. A planta ainda necessita de outros nutrientes e de manejo adequado.', reviewPage: 'campo-a-mesa' },
    { category: 'Desenvolvimento da planta', difficulty: 'facil', question: 'O que caracteriza os estágios reprodutivos (R) da soja?', options: ['Emergência das plântulas e abertura dos cotilédones', 'Crescimento das raízes e correção da acidez do solo', 'Floração, vagens e enchimento dos grãos na planta', 'Colheita, secagem e armazenagem dos grãos'], correctIndex: 2, explanation: 'Os estágios R acompanham a fase reprodutiva, incluindo flores, vagens e desenvolvimento dos grãos. Identificar o estágio ajuda a planejar avaliações e operações no momento adequado.', reviewPage: 'campo-a-mesa' },
    { category: 'Armazenagem', difficulty: 'facil', question: 'Por que a umidade dos grãos deve ser monitorada durante o armazenamento?', options: ['Para definir a variedade que será plantada na safra seguinte', 'Para aumentar o tamanho e o peso legal da saca', 'Para evitar deterioração e preservar a qualidade', 'Para alterar a cotação internacional no dia da venda'], correctIndex: 2, explanation: 'Umidade e temperatura inadequadas podem favorecer deterioração e perda de qualidade. A secagem e a armazenagem devem seguir critérios técnicos apropriados ao grão e à estrutura.', reviewPage: 'campo-a-mesa' },
    { category: 'Logística', difficulty: 'facil', question: 'Quais são três modais usados no transporte de grãos no Brasil?', options: ['Aéreo, dutoviário e por teleférico', 'Apenas rodoviário, em todas as regiões', 'Marítimo e aéreo, sem etapa terrestre', 'Rodoviário, ferroviário e hidroviário'], correctIndex: 3, explanation: 'Rodovias, ferrovias e hidrovias participam do escoamento em diferentes combinações. A rota disponível e a distância alteram custos, tempo e capacidade.', reviewPage: 'cadeia' },
    { category: 'Mercado', difficulty: 'facil', question: 'O que é um bushel no contexto da cotação de grãos?', options: ['Unidade de quantidade usada em contratos e cotações de grãos', 'Moeda de referência usada nas exportações para a Europa', 'Tipo de fertilizante nitrogenado usado na semeadura', 'Medida de área usada para cálculo de produtividade'], correctIndex: 0, explanation: 'Bushel é uma unidade de quantidade usada na comercialização de algumas commodities. Para soja, a conversão em massa é aproximada e depende da convenção do produto; não é uma medida de área.', reviewPage: 'mercado' },
    { category: 'Mercado', difficulty: 'facil', question: 'Se a procura por soja aumenta e a oferta não muda, o que pode acontecer com o preço?', options: ['O preço necessariamente zera', 'A demanda deixa de existir', 'O câmbio passa a ser irrelevante', 'Pode haver pressão de alta'], correctIndex: 3, explanation: 'Mantidas as demais condições, mais compradores disputando uma oferta estável podem pressionar o preço para cima. Estoques, substitutos, câmbio e expectativas também influenciam o mercado.', reviewPage: 'mercado' },

    { category: 'Manejo do solo', difficulty: 'intermediaria', question: 'Qual prática é central no Sistema Plantio Direto?', options: ['Queimar a palhada após a colheita para limpar o terreno', 'Arar e gradear o solo em todas as safras antes de semear', 'Semear sobre palhada, com mínimo revolvimento do solo', 'Manter o solo descoberto entre safras para aquecê-lo'], correctIndex: 2, explanation: 'O sistema se apoia em cobertura permanente, rotação de culturas e mínimo revolvimento. Os resultados dependem do conjunto de práticas e das condições da propriedade.', reviewPage: 'sustentabilidade' },
    { category: 'Safras', difficulty: 'intermediaria', question: 'Na sucessão soja–milho safrinha, por que o calendário da colheita da soja importa?', options: ['Determina sozinha a cotação da CBOT no mês seguinte', 'Dispensa a necessidade de chuva na segunda safra', 'Ajuda a definir a janela para semear o milho', 'Define qual variedade de milho é legalmente permitida'], correctIndex: 2, explanation: 'A colheita da soja influencia o tempo disponível para implantar o milho de segunda safra. A viabilidade depende da região, do clima, do calendário e do manejo.', reviewPage: 'campo-a-mesa' },
    { category: 'Sanidade vegetal', difficulty: 'intermediaria', question: 'A ferrugem asiática da soja é causada por qual tipo de agente?', options: ['Um fungo que ataca as folhas da soja', 'Uma bactéria que apodrece as raízes', 'Um vírus transmitido por pulgões', 'Uma deficiência de fósforo nas folhas'], correctIndex: 0, explanation: 'A ferrugem asiática é uma doença causada por fungo. Monitoramento, prevenção e decisões de controle devem seguir recomendações técnicas locais.', reviewPage: 'campo-a-mesa' },
    { category: 'Câmbio e preços', difficulty: 'intermediaria', question: 'Se o dólar sobe frente ao real, qual efeito pode ocorrer para uma receita de exportação em dólares?', options: ['A cotação em dólares da CBOT sobe automaticamente', 'Os custos da fazenda desaparecem', 'Pode valer mais reais, sem garantir maior lucro', 'A produtividade aumenta imediatamente'], correctIndex: 2, explanation: 'Um dólar mais alto pode elevar a conversão de uma mesma receita em moeda estrangeira para reais. Custos importados, contratos e proteção cambial também influenciam o resultado.', reviewPage: 'mercado' },
    { category: 'Risco financeiro', difficulty: 'intermediaria', question: 'O que significa fazer hedge em uma operação agrícola?', options: ['Garantir lucro ao produtor em qualquer cenário de mercado', 'Aumentar a produtividade da lavoura com novas cultivares', 'Armazenar grãos por longos períodos sem controle de umidade', 'Reduzir a exposição a variações de preço ou de câmbio'], correctIndex: 3, explanation: 'Hedge é uma estratégia de proteção contra riscos de mercado, por exemplo com contratos futuros ou opções. Ele pode reduzir algumas exposições, mas não elimina todos os riscos nem garante lucro.', reviewPage: 'mercado' },
    { category: 'Sensoriamento remoto', difficulty: 'intermediaria', question: 'O que o NDVI ajuda a estimar em imagens de satélite?', options: ['Preço futuro da soja', 'Vigor relativo da vegetação', 'Teor exato de proteína de cada grão', 'Limite legal de uma propriedade'], correctIndex: 1, explanation: 'O NDVI é um índice calculado a partir da resposta espectral da vegetação e pode ajudar a observar diferenças de vigor. Ele não mede diretamente produtividade final e precisa ser interpretado no contexto.', reviewPage: 'tecnologia' },
    { category: 'Economia rural', difficulty: 'intermediaria', question: 'Como se calcula, de forma simplificada, o ponto de equilíbrio por saca?', options: ['Custo total por hectare dividido pelas sacas colhidas por hectare', 'Preço de venda da saca dividido pelo total de hectares plantados na safra', 'Receita bruta por hectare multiplicada pela cotação do dólar no dia', 'Produtividade por hectare menos o número de máquinas utilizadas'], correctIndex: 0, explanation: 'Dividir o custo total por hectare pela produção em sacas por hectare estima o custo por saca. Um orçamento completo deve definir quais custos e receitas estão incluídos.', reviewPage: 'custos' },
    { category: 'Rastreabilidade', difficulty: 'intermediaria', question: 'Para que servem registros de origem e movimentação de um lote de soja?', options: ['Garantir, sozinhos, que toda a cadeia é sustentável', 'Apoiar a rastreabilidade e a checagem de requisitos do lote', 'Substituir o controle de qualidade do lote', 'Definir a produtividade da próxima safra'], correctIndex: 1, explanation: 'Registros ajudam a acompanhar origem e movimentação e podem apoiar auditorias e due diligence. A documentação precisa ser correta e não substitui verificação independente ou cumprimento das regras aplicáveis.', reviewPage: 'sustentabilidade' },
    { category: 'Custos de produção', difficulty: 'intermediaria', question: 'Por que fertilizantes e defensivos podem representar parte importante dos custos da lavoura?', options: ['Porque são comprados e seus preços variam com o mercado e o câmbio', 'Porque são distribuídos gratuitamente aos produtores pelo governo', 'Porque definem sozinhos o preço da soja na bolsa de Chicago', 'Porque eliminam por completo os riscos climáticos da lavoura'], correctIndex: 0, explanation: 'Esses insumos podem ter peso relevante e seus preços variam por produto, safra, região e condições de mercado. A participação exata deve ser calculada com orçamento local.', reviewPage: 'custos' },
    { category: 'Manejo integrado', difficulty: 'intermediaria', question: 'Qual é uma característica do manejo integrado de pragas?', options: ['Monitorar a lavoura e combinar métodos conforme o risco', 'Aplicar o mesmo produto em todas as safras, sem reavaliar', 'Tolerar qualquer infestação para preservar insetos benéficos', 'Dispensar a assistência técnica após a primeira aplicação'], correctIndex: 0, explanation: 'O manejo integrado combina monitoramento, níveis de ação e diferentes métodos de controle. A decisão depende da praga, da fase da cultura e da recomendação profissional.', reviewPage: 'sustentabilidade' },

    { category: 'Regulação e mercado', difficulty: 'avancada', question: 'Em termos gerais, o que a regulação europeia EUDR exige de operadores abrangidos que colocam produtos relevantes no mercado da União Europeia?', options: ['Apenas um selo informando o país de origem do produto', 'Que todos os produtores adotem irrigação em larga escala', 'Due diligence e dados sobre legalidade e desmatamento', 'Que toda a soja seja vendida apenas na bolsa de Chicago'], correctIndex: 2, explanation: 'A EUDR prevê obrigações de due diligence para operadores e produtos abrangidos, incluindo geolocalização e avaliação de requisitos legais e de desmatamento. Escopo, prazos e aplicação devem ser conferidos na legislação vigente.', reviewPage: 'sustentabilidade' },
    { category: 'Bioeconomia', difficulty: 'avancada', question: 'O que representa um CBIO no programa RenovaBio?', options: ['Uma saca de soja padronizada, negociada na bolsa de Chicago', 'Um fertilizante nitrogenado de liberação lenta usado em lavouras de soja', 'Um índice de vegetação medido por satélite sobre as lavouras', 'Crédito ligado à redução certificada de emissões na produção de biocombustíveis'], correctIndex: 3, explanation: 'O Crédito de Descarbonização (CBIO) é um instrumento do RenovaBio associado ao desempenho de eficiência energético-ambiental de produtores de biocombustíveis. Regras e valores dependem da regulamentação vigente.', reviewPage: 'sustentabilidade' },
    { category: 'Contratos futuros', difficulty: 'avancada', question: 'Qual é a quantidade padrão associada ao contrato futuro de soja da CBOT?', options: ['5.000 bushels', '500 sacas de 60 kg', '1.000 toneladas métricas', '10.000 quilos por lote'], correctIndex: 0, explanation: 'A especificação padrão do contrato futuro de soja da CBOT é 5.000 bushels. O contrato futuro é uma unidade padronizada de mercado e não corresponde ao volume de toda venda física.', reviewPage: 'mercado' },
    { category: 'Câmbio e custos', difficulty: 'avancada', question: 'Se o dólar cai 10%, qual conclusão é mais responsável sobre o custo de fertilizantes de uma fazenda?', options: ['Todo o custo da fazenda cai exatamente 10%, de forma imediata e uniforme', 'A cotação internacional da soja sobe de forma automática e na mesma proporção', 'A produtividade média das lavouras dobra no ciclo agrícola seguinte', 'Pode reduzir parte dos custos em dólar, dependendo de contratos e estoques'], correctIndex: 3, explanation: 'A exposição cambial varia por insumo, estoque, contrato, frete e momento de compra. Uma mudança no dólar não se transfere automaticamente na mesma proporção para o custo total.', reviewPage: 'custos' },
    { category: 'Unidades e produtividade', difficulty: 'avancada', question: 'Uma produção de 60 sacas por hectare, usando sacas de 60 kg, equivale a quantas toneladas por hectare?', options: ['0,6 t/ha', '6 t/ha', '36 t/ha', '3,6 t/ha'], correctIndex: 3, explanation: '60 sacas × 60 kg = 3.600 kg. Como 1 tonelada corresponde a 1.000 kg, isso equivale a 3,6 toneladas por hectare.', reviewPage: 'custos' },
    { category: 'Processamento', difficulty: 'avancada', question: 'Ao estimar os produtos de uma tonelada de soja esmagada, por que óleo, farelo e outras frações devem ser tratados como valores aproximados?', options: ['Toda fábrica produz exatamente as mesmas massas de óleo e farelo', 'O rendimento varia com a qualidade do grão e a indústria', 'O transporte altera a composição química do grão em cada viagem', 'A saca de soja muda de peso durante o cálculo'], correctIndex: 1, explanation: 'Composição, umidade, limpeza, variedade e tecnologia de processamento influenciam os rendimentos. Percentuais usados em uma atividade educativa devem ser identificados como ilustrativos e comparados com fontes técnicas.', reviewPage: 'cadeia' },
    { category: 'Solo e nutrição', difficulty: 'avancada', question: 'A fixação biológica de nitrogênio elimina a necessidade de analisar outros nutrientes do solo?', options: ['Sim. A soja inoculada não precisa de nenhum outro nutriente do solo', 'Sim. Com a FBN, a análise do solo deixa de ser necessária em qualquer área', 'Não. Ela supre nitrogênio, mas outros nutrientes ainda exigem avaliação do solo', 'Não. A FBN serve apenas para controlar insetos e doenças'], correctIndex: 2, explanation: 'A FBN pode suprir grande parte da necessidade de nitrogênio da soja, mas não substitui fósforo, potássio, enxofre, micronutrientes ou correção quando recomendados. A análise do solo continua importante.', reviewPage: 'campo-a-mesa' },
    { category: 'Clima e produção', difficulty: 'avancada', question: 'Por que uma quebra de safra não determina sozinha o preço final recebido pelo produtor?', options: ['Porque câmbio, estoques, frete, contratos e demanda também pesam', 'Porque a oferta nunca influencia o preço recebido pelo produtor rural', 'Porque toda a soja do país é vendida por um valor fixo definido a cada ano', 'Porque o clima altera apenas a cor e o tamanho dos grãos colhidos'], correctIndex: 0, explanation: 'Uma redução de oferta pode pressionar preços, mas o valor local também depende de demanda, estoques, câmbio, logística, prêmio regional e condições contratuais.', reviewPage: 'mercado' },
    { category: 'Conservação', difficulty: 'avancada', question: 'Qual interpretação é mais adequada ao comparar um sistema convencional e um regenerativo?', options: ['Um rótulo de sistema regenerativo prova que todo impacto foi eliminado', 'Os resultados variam por contexto e exigem indicadores definidos', 'Um único indicador de carbono descreve toda a sustentabilidade da área', 'Todo produtor convencional adota exatamente o mesmo tipo de manejo'], correctIndex: 1, explanation: 'Sistemas agrícolas são diversos. Comparações úteis especificam práticas, contexto, período e indicadores, sem tratar categorias amplas como resultados garantidos.', reviewPage: 'sustentabilidade' },
    { category: 'Gestão de risco', difficulty: 'avancada', question: 'Qual afirmação sobre hedge é correta?', options: ['Reduz uma exposição específica, mas tem custos e não elimina todo risco', 'Garante ao produtor o preço mais alto praticado no mercado durante a safra', 'Substitui por completo o planejamento financeiro da propriedade rural', 'É uma técnica para medir a umidade dos grãos nos silos'], correctIndex: 0, explanation: 'Hedge pode ajudar a administrar uma exposição de preço ou câmbio, mas envolve contratos, margens, custos e risco de base. A estratégia deve ser compreendida antes de ser usada.', reviewPage: 'mercado' },
    { category: 'Rastreabilidade', difficulty: 'avancada', question: 'Um mapa de satélite com NDVI, sozinho, comprova a origem legal de um lote de soja?', options: ['Sim. Ele mede diretamente a propriedade, seus contratos e sua cadeia', 'Não. É um indicador de vegetação e precisa de registros e verificação', 'Sim. Em todos os casos a imagem de satélite basta para comprovar a origem', 'Não. Imagens de satélite não podem apoiar nenhum tipo de monitoramento'], correctIndex: 1, explanation: 'NDVI ajuda a observar a vegetação, mas não identifica sozinho um lote, sua cadeia de custódia ou conformidade legal. Rastreabilidade requer dados e processos complementares.', reviewPage: 'tecnologia' },
    { category: 'Objetivos de Desenvolvimento Sustentável', difficulty: 'avancada', question: 'Por que a cadeia da soja pode se relacionar a vários ODS ao mesmo tempo?', options: ['Porque os ODS são metas de preço definidas para cada commodity', 'Porque qualquer produto atende automaticamente a todos os ODS', 'Porque os ODS substituem por completo as leis nacionais sobre produção agrícola', 'Porque a cadeia envolve dimensões econômicas, sociais e ambientais'], correctIndex: 3, explanation: 'A cadeia envolve diferentes atividades e resultados. A relação com cada ODS depende de práticas e evidências, e não significa que toda produção contribua automaticamente para todas as metas.', reviewPage: 'sustentabilidade' }
];

const quizStorageKey = 'ecosoja.quiz.progress.v1';
const quizDifficultyLabels = { mista: 'Mista', facil: 'Básica', intermediaria: 'Intermediária', avancada: 'Avançada' };
const quizReviewLabels = {
    mercado: 'Mercado da Soja',
    cadeia: 'Cadeia Produtiva',
    custos: 'Custos e Regiões',
    tecnologia: 'Tecnologia',
    sustentabilidade: 'Meio Ambiente e ODS',
    'campo-a-mesa': 'Do campo à mesa'
};

let quizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false,
    timerEnabled: false,
    timerHandle: null,
    remainingSeconds: 30,
    difficulty: 'mista',
    correctIndex: -1
};

function loadQuizProgress() {
    const defaultProgress = { rounds: 0, totalQuestions: 0, correctAnswers: 0, bestPercent: 0, badges: [] };
    try {
        const stored = JSON.parse(localStorage.getItem(quizStorageKey));
        if (!stored || typeof stored !== 'object') return defaultProgress;
        return { ...defaultProgress, ...stored, badges: Array.isArray(stored.badges) ? stored.badges : [] };
    } catch {
        return defaultProgress;
    }
}

let quizProgress = loadQuizProgress();

function saveQuizProgress() {
    try {
        localStorage.setItem(quizStorageKey, JSON.stringify(quizProgress));
    } catch {
        document.getElementById('quiz-progress-summary').textContent = 'Não foi possível salvar o progresso neste navegador.';
    }
}

function renderQuizProgress() {
    const summary = document.getElementById('quiz-progress-summary');
    const badgesContainer = document.getElementById('quiz-earned-badges');
    if (!summary || !badgesContainer) return;

    const best = quizProgress.rounds ? `${quizProgress.bestPercent}%` : 'Ainda sem rodadas';
    summary.textContent = `${quizProgress.rounds} rodadas concluídas · ${quizProgress.correctAnswers} acertos acumulados · melhor resultado: ${best}`;
    badgesContainer.replaceChildren(...quizProgress.badges.map(badge => {
        const item = document.createElement('span');
        item.className = 'quiz-badge';
        item.textContent = badge;
        return item;
    }));
}

function initQuiz() {
    renderQuizProgress();
    if (quizState.questions.length > 0 && document.getElementById('quiz-result').classList.contains('hidden')) {
        document.getElementById('quiz-setup').classList.add('hidden');
        document.getElementById('quiz-box').classList.remove('hidden');
        if (!quizState.answered) startQuizTimer(true);
        return;
    }

    stopQuizTimer();
    document.getElementById('quiz-setup').classList.remove('hidden');
    document.getElementById('quiz-box').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
}

function shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function startQuiz() {
    stopQuizTimer();
    const requestedDifficulty = document.getElementById('quiz-difficulty').value;
    const questionCount = Number(document.getElementById('quiz-round-size').value);
    const questionPool = requestedDifficulty === 'mista'
        ? quizQuestions
        : quizQuestions.filter(question => question.difficulty === requestedDifficulty);

    quizState = {
        questions: shuffleQuestions(questionPool).slice(0, questionCount),
        currentIndex: 0,
        score: 0,
        answered: false,
        timerEnabled: document.getElementById('quiz-timer-toggle').checked,
        timerHandle: null,
        remainingSeconds: 30,
        difficulty: requestedDifficulty,
        correctIndex: -1
    };

    document.getElementById('quiz-setup').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    loadQuizQuestion();
}

function stopQuizTimer() {
    if (quizState.timerHandle) window.clearInterval(quizState.timerHandle);
    quizState.timerHandle = null;
}

function startQuizTimer(resume = false) {
    const timer = document.getElementById('quiz-timer-display');
    stopQuizTimer();
    if (!quizState.timerEnabled) {
        timer.classList.add('hidden');
        timer.classList.remove('is-low');
        return;
    }

    timer.classList.remove('hidden');
    if (!resume || quizState.remainingSeconds <= 0) quizState.remainingSeconds = 30;
    timer.textContent = `Tempo restante: ${quizState.remainingSeconds} s`;
    timer.classList.toggle('is-low', quizState.remainingSeconds <= 10);
    quizState.timerHandle = window.setInterval(() => {
        quizState.remainingSeconds -= 1;
        timer.textContent = `Tempo restante: ${quizState.remainingSeconds} s`;
        timer.classList.toggle('is-low', quizState.remainingSeconds <= 10);
        if (quizState.remainingSeconds <= 0) selectQuizAnswer(null);
    }, 1000);
}

function loadQuizQuestion() {
    const question = quizState.questions[quizState.currentIndex];
    if (!question) return;
    quizState.answered = false;

    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('quiz-question-counter').textContent = `Pergunta ${quizState.currentIndex + 1} de ${quizState.questions.length}`;
    document.getElementById('quiz-score-live').textContent = `Pontuação: ${quizState.score}`;
    document.getElementById('quiz-category').textContent = question.category;
    document.getElementById('quiz-difficulty-tag').textContent = quizDifficultyLabels[question.difficulty];
    document.getElementById('quiz-question').textContent = question.question;

    const progressPercent = Math.round(((quizState.currentIndex + 1) / quizState.questions.length) * 100);
    document.getElementById('quiz-progress-bar').style.width = `${progressPercent}%`;
    document.querySelector('.quiz-progress-track').setAttribute('aria-valuenow', String(progressPercent));

    const optionsContainer = document.getElementById('quiz-options');
    const letters = ['A', 'B', 'C', 'D'];
    const shuffledOptions = shuffleQuestions(
        question.options.map((text, index) => ({ text, isCorrect: index === question.correctIndex }))
    );
    quizState.correctIndex = shuffledOptions.findIndex(option => option.isCorrect);
    optionsContainer.replaceChildren(...shuffledOptions.map((option, index) => {
        const button = document.createElement('button');
        const letter = document.createElement('span');
        const label = document.createElement('span');
        button.className = 'quiz-option-btn';
        button.type = 'button';
        button.dataset.quizAnswer = String(index);
        letter.className = 'quiz-option-letter';
        letter.textContent = letters[index];
        label.textContent = option.text;
        button.append(letter, label);
        button.addEventListener('click', () => selectQuizAnswer(index));
        return button;
    }));

    document.getElementById('quiz-review-btn').textContent = `Revisar tema: ${quizReviewLabels[question.reviewPage]}`;
    startQuizTimer();
}

function selectQuizAnswer(selectedIndex) {
    if (quizState.answered) return;
    quizState.answered = true;
    stopQuizTimer();
    document.getElementById('quiz-timer-display').classList.add('hidden');

    const question = quizState.questions[quizState.currentIndex];
    const isCorrect = selectedIndex === quizState.correctIndex;
    if (isCorrect) quizState.score += 1;

    document.querySelectorAll('.quiz-option-btn').forEach((button, index) => {
        button.disabled = true;
        if (index === quizState.correctIndex) button.classList.add('correct');
        else if (index === selectedIndex) button.classList.add('wrong');
    });

    document.getElementById('quiz-score-live').textContent = `Pontuação: ${quizState.score}`;
    const feedbackTitle = document.getElementById('feedback-title');
    feedbackTitle.className = `feedback-title ${isCorrect ? 'correct-title' : 'wrong-title'}`;
    feedbackTitle.textContent = selectedIndex === null ? 'Tempo esgotado.' : isCorrect ? 'Resposta correta!' : 'Resposta incorreta.';
    document.getElementById('feedback-text').textContent = question.explanation;
    document.getElementById('quiz-next-btn').textContent = quizState.currentIndex === quizState.questions.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
    document.getElementById('quiz-feedback').classList.remove('hidden');
}

function nextQuestion() {
    if (quizState.currentIndex < quizState.questions.length - 1) {
        quizState.currentIndex += 1;
        loadQuizQuestion();
    } else {
        showQuizResult();
    }
}

function updateQuizBadges(percent) {
    const newBadges = [];
    if (percent >= 70) newBadges.push('Agrônomo Iniciante');
    if (percent === 100) newBadges.push('Trader de Chicago');
    if (quizProgress.rounds >= 3) newBadges.push('Semeador Persistente');
    const trulyNew = newBadges.filter(badge => !quizProgress.badges.includes(badge));
    quizProgress.badges.push(...trulyNew);
    return trulyNew;
}

function showQuizResult() {
    stopQuizTimer();
    if (quizState.questions.length === 0) return; // rodada já contabilizada
    document.getElementById('quiz-box').classList.add('hidden');
    const resultBox = document.getElementById('quiz-result');
    resultBox.classList.remove('hidden');

    const total = quizState.questions.length;
    const score = quizState.score;
    const percent = Math.round((score / total) * 100);
    quizProgress.rounds += 1;
    quizProgress.totalQuestions += total;
    quizProgress.correctAnswers += score;
    quizProgress.bestPercent = Math.max(quizProgress.bestPercent, percent);
    const earnedBadges = updateQuizBadges(percent);
    saveQuizProgress();
    renderQuizProgress();

    document.getElementById('result-score').textContent = `Você acertou ${score} de ${total} perguntas (${percent}%).`;
    document.getElementById('result-bar-fill').style.width = `${percent}%`;
    document.querySelector('.result-bar-wrap').setAttribute('aria-valuenow', String(percent));
    document.getElementById('quiz-badge-earned').textContent = earnedBadges.length
        ? `Badge${earnedBadges.length > 1 ? 's' : ''} desta rodada: ${earnedBadges.join(' · ')}`
        : 'Continue praticando para conquistar um badge.';

    const title = document.getElementById('result-title');
    const message = document.getElementById('result-msg');
    document.getElementById('result-icon').textContent = percent === 100 ? '🏆' : percent >= 70 ? '🌾' : '🌱';
    title.textContent = percent === 100 ? 'Rodada perfeita!' : percent >= 70 ? 'Bom domínio do tema!' : 'Hora de revisar e tentar de novo.';
    message.textContent = 'Use os links de revisão após cada pergunta para aprofundar o conteúdo. Seu progresso fica salvo neste navegador.';

    // Encerra a rodada: evita reabrir a última pergunta e contar a rodada duas vezes
    quizState.questions = [];
    quizState.currentIndex = 0;
}

function restartQuiz() {
    startQuiz();
}

function initQuizControls() {
    document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
    document.getElementById('quiz-next-btn').addEventListener('click', nextQuestion);
    document.getElementById('quiz-restart-btn').addEventListener('click', restartQuiz);
    document.getElementById('quiz-review-btn').addEventListener('click', () => {
        const question = quizState.questions[quizState.currentIndex];
        if (question) navigate(question.reviewPage);
    });
    renderQuizProgress();
}

const glossaryTerms = [
    { term: 'CBOT', definition: 'Chicago Board of Trade: mercado de contratos futuros de commodities que integra o CME Group.', page: 'mercado' },
    { term: 'Bushel', definition: 'Unidade de quantidade usada em cotações de grãos. Para soja, a conversão em massa é aproximada e segue convenção do produto.', page: 'mercado' },
    { term: 'Saca', definition: 'Unidade comercial brasileira normalmente equivalente a 60 kg de soja.', page: 'custos' },
    { term: 'Hedge', definition: 'Estratégia que pode reduzir uma exposição a preço ou câmbio, sem eliminar todos os riscos nem garantir lucro.', page: 'mercado' },
    { term: 'NDVI', definition: 'Índice de vegetação calculado com dados espectrais, usado para observar diferenças de vigor; não mede diretamente a produtividade final.', page: 'tecnologia' },
    { term: 'FBN', definition: 'Fixação Biológica de Nitrogênio: associação entre plantas e microrganismos que disponibiliza nitrogênio à cultura.', page: 'sustentabilidade' },
    { term: 'CBIO', definition: 'Crédito de Descarbonização do RenovaBio, ligado ao desempenho energético-ambiental de produtores de biocombustíveis.', page: 'sustentabilidade' },
    { term: 'EUDR', definition: 'Regulamento da União Europeia sobre produtos associados ao desmatamento e à degradação florestal; consulte o texto e os prazos vigentes.', page: 'sustentabilidade' },
    { term: 'Farelo', definition: 'Coproduto do processamento da soja, usado principalmente como ingrediente proteico em rações.', page: 'cadeia' },
    { term: 'Esmagamento', definition: 'Processamento industrial do grão para obtenção principalmente de óleo e farelo.', page: 'cadeia' },
    { term: 'Safrinha', definition: 'Nome popular da segunda safra, como o milho cultivado após a soja em regiões e calendários adequados.', page: 'campo-a-mesa' },
    { term: 'Produtividade', definition: 'Quantidade produzida por unidade de área, frequentemente expressa em sacas por hectare.', page: 'custos' }
];

function renderGlossary(query = '') {
    const results = document.getElementById('glossary-results');
    if (!results) return;
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    const matches = glossaryTerms.filter(item => `${item.term} ${item.definition}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery));
    const fragment = document.createDocumentFragment();

    matches.forEach(item => {
        const term = document.createElement('dt');
        const link = document.createElement('button');
        const definition = document.createElement('dd');
        term.className = 'glossary-entry-term';
        link.className = 'glossary-tooltip';
        link.type = 'button';
        link.textContent = item.term;
        link.title = item.definition;
        link.setAttribute('aria-label', `${item.term}: ${item.definition}. Abrir ${quizReviewLabels[item.page] || item.page}.`);
        link.addEventListener('click', () => navigate(item.page));
        definition.textContent = item.definition;
        fragment.append(term, definition);
        term.appendChild(link);
    });

    results.replaceChildren(fragment);
    document.getElementById('glossary-count').textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? 'termo encontrado' : 'termos encontrados'}`
        : 'Nenhum termo encontrado.';
}

function initGlossary() {
    const search = document.getElementById('glossary-search');
    if (!search) return;
    search.addEventListener('input', () => renderGlossary(search.value));
    renderGlossary();
}

const referenceSources = [
    {
        id: 'embrapa-soja',
        category: 'oficial',
        title: 'Embrapa Soja — Produção, manejo e sustentabilidade',
        description: 'Pesquisas e materiais técnicos da principal instituição de pesquisa agropecuária do Brasil, com foco em manejo, variedades, produtividade e sustentabilidade.',
        url: 'https://www.embrapa.br/soja'
    },
    {
        id: 'conab',
        category: 'oficial',
        title: 'CONAB — Boletim e dados da soja brasileira',
        description: 'Estimativas de produção, comercialização, safras e alocação regional da soja no Brasil.',
        url: 'https://www.conab.gov.br'
    },
    {
        id: 'usda',
        category: 'mercado',
        title: 'USDA — World Agricultural Supply and Demand Estimates (WASDE)',
        description: 'Indicadores globais para oferta, demanda, exportações e expectativas de mercado da soja.',
        url: 'https://www.usda.gov'
    },
    {
        id: 'cme',
        category: 'mercado',
        title: 'CME Group — Contratos futuros de soja',
        description: 'Especificações de mercado e informações sobre contratos futuros e preços de referência internacionais.',
        url: 'https://www.cmegroup.com'
    },
    {
        id: 'ibge',
        category: 'oficial',
        title: 'IBGE — Produção agrícola e estatísticas regionais',
        description: 'Dados produzidos pelo Instituto Brasileiro de Geografia e Estatística sobre produção e indicadores agrícolas.',
        url: 'https://www.ibge.gov.br'
    },
    {
        id: 'mapa',
        category: 'oficial',
        title: 'MAPA — Ministério da Agricultura e Pecuária',
        description: 'Dados institucionais, normas, produção e políticas agropecuárias do Brasil.',
        url: 'https://www.gov.br/agricultura'
    },
    {
        id: 'ods-un',
        category: 'sustentabilidade',
        title: 'Nações Unidas — Objetivos de Desenvolvimento Sustentável (ODS)',
        description: 'Painel das metas da Agenda 2030 e seus indicadores relacionados a produção, clima, consumo e vida terrestre.',
        url: 'https://brasil.un.org/pt-br/sdgs'
    },
    {
        id: 'renovabio',
        category: 'sustentabilidade',
        title: 'RenovaBio — Programa de descarbonização da matriz energética',
        description: 'Documentação do programa brasileiro de biocombustíveis e CBIOs, com foco em bioenergia e descarbonização.',
        url: 'https://www.gov.br/anp/pt-br/assuntos/renovabio'
    },
    {
        id: 'eudr',
        category: 'sustentabilidade',
        title: 'EU Deforestation Regulation (EUDR) — regulamentação e orientações',
        description: 'Texto e orientações sobre rastreabilidade e prevenção de desmatamento associados a produtos relevantes importados pela União Europeia.',
        url: 'https://environment.ec.europa.eu/topics/forests/deforestation/regulation-forest-products_en'
    },
    {
        id: 'rtrs',
        category: 'sustentabilidade',
        title: 'RTRS — Responsible Soy / cadeia responsável',
        description: 'Organização internacional que desenvolve critérios de produção responsável e rastreabilidade de soja sustentável.',
        url: 'https://rtrs.org'
    },
    {
        id: 'unesp',
        category: 'academico',
        title: 'UNESP — Pesquisas e extensão em agroecologia e produção',
        description: 'Pesquisas universitárias e projetos de extensão em agronegócio, produção sustentável e desenvolvimento regional.',
        url: 'https://www.unesp.br'
    },
    {
        id: 'fao',
        category: 'academico',
        title: 'FAO — Organização das Nações Unidas para a Alimentação e a Agricultura',
        description: 'Indicadores globais, dados e relatórios sobre alimentos, agricultura, produção e segurança alimentar.',
        url: 'https://www.fao.org'
    }
];

function renderReferences() {
    const list = document.getElementById('references-list');
    const searchValue = document.getElementById('refs-search')?.value || '';
    const activeFilter = document.querySelector('.ref-filter.is-active')?.dataset.refFilter || 'all';
    if (!list) return;

    const normalizedQuery = searchValue.trim().toLocaleLowerCase('pt-BR');
    const matches = referenceSources.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
        const searchable = `${item.title} ${item.description}`.toLocaleLowerCase('pt-BR');
        const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);
        return matchesFilter && matchesSearch;
    });

    list.innerHTML = matches.length
        ? matches.map(item => `
            <article class="reference-card card" data-ref-category="${item.category}">
                <div class="reference-card-head">
                    <span class="reference-tag">${item.category}</span>
                    <a href="${item.url}" target="_blank" rel="noreferrer">Abrir fonte ↗</a>
                </div>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <small>${item.url}</small>
            </article>
        `).join('')
        : '<div class="card"><p>Nenhuma fonte encontrada para esse filtro ou termo.</p></div>';
}

function initReferencesModule() {
    const search = document.getElementById('refs-search');
    if (!search) return;
    search.addEventListener('input', renderReferences);
    document.querySelectorAll('.ref-filter').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.ref-filter').forEach(item => item.classList.toggle('is-active', item === button));
            renderReferences();
        });
    });
    renderReferences();
}

initQuizControls();
initGlossary();
initReferencesModule();
