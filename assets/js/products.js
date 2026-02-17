// Product details modal handler

const productData = {
	alocasia: {
		name: 'Alocasia',
		image: 'assets/images/alocasia.jpg',
		description: 'Tropical foliage plant with stunning large leaves.',
		features: [
			'Eye-catching arrow-shaped leaves',
			'Thrives in bright indirect light',
			'Air-purifying properties',
			'Suitable for indoor decoration',
			'Grown from tissue culture for uniformity'
		],
		uses: 'Premium indoor landscaping, office décor, nursery retail',
		care: 'Water when top soil is dry. Prefers humidity. Avoid cold drafts.'
	},
	anthurium: {
		name: 'Anthurium',
		image: 'assets/images/anthurium.jpg',
		description: 'Ornamental flowering plant with vibrant heart-shaped blooms.',
		features: [
			'Long-lasting red/pink/white flowers',
			'Glossy dark green foliage',
			'Continuous flowering throughout year',
			'Low-maintenance indoor plant',
			'Tissue culture propagated for purity'
		],
		uses: 'Cut flowers, indoor ornament, corporate gifting',
		care: 'Bright indirect light, high humidity, warm temperature. Water weekly.'
	},
	banana: {
		name: 'Banana',
		image: 'assets/images/banana.jpg',
		description: 'High-yield tissue culture banana plants (Grand Naine, G10).',
		features: [
			'Virus-free elite clones',
			'Uniform growth and bunching',
			'High fruit yield',
			'Disease-resistant genetics',
			'Faster maturity vs. traditional plants'
		],
		uses: 'Commercial plantation, smallholder farms, agribusiness',
		care: 'Well-drained soil, regular irrigation, NPK fertilization. Harvest at 110-120 days.'
	},
	bamboo: {
		name: 'Bamboo',
		image: 'assets/images/bamboo.jpg',
		description: 'Fast-growing forestry and agroforestry species.',
		features: [
			'Rapid biomass production',
			'Excellent for erosion control',
			'High timber/pulp value',
			'Sustainable agroforestry crop',
			'Low input requirement'
		],
		uses: 'Forestry plantation, agroforestry, biomass production, handicrafts',
		care: 'Plant in well-prepared soil. Minimal maintenance once established. Regular thinning.'
	},
	calathea: {
		name: 'Calathea',
		image: 'assets/images/calathea.jpg',
		description: 'Indoor decorative foliage plant with intricate leaf patterns.',
		features: [
			'Beautiful patterned leaves',
			'Compact growth habit',
			'Non-toxic to pets',
			'Air-purifying plant',
			'Tissue culture propagated'
		],
		uses: 'Indoor plants, office décor, low-light rooms, houseplant retail',
		care: 'Indirect light, high humidity, keep soil moist. Avoid water on leaves.'
	},
	'calla-lily': {
		name: 'Calla Lily',
		image: 'assets/images/calla-lily.jpg',
		description: 'Premium flowering variety with elegant trumpet-shaped blooms.',
		features: [
			'Stunning white/pink/yellow flowers',
			'Excellent for cut flowers',
			'Long vase life',
			'Suitable for both indoor and outdoor',
			'Tissue culture for disease-free plants'
		],
		uses: 'Cut flower industry, ornamental garden, wedding decorations, floristry',
		care: 'Well-drained soil, moderate watering, indirect sunlight. Blooms in 4-6 weeks.'
	},
	cardamom: {
		name: 'Cardamom',
		image: 'assets/images/cardamom.jpg',
		description: 'Commercial spice crop with high market demand.',
		features: [
			'Disease-free planting material',
			'Superior pod quality',
			'High yielding varieties',
			'Aromatic seeds of premium grade',
			'Tissue culture uniformity'
		],
		uses: 'Commercial spice farming, export-oriented cultivation, agribusiness',
		care: 'Shade requirement, moist soil, regular irrigation. Harvest pods at 8-10 months.'
	},
	cordyline: {
		name: 'Cordyline',
		image: 'assets/images/cordyline.jpg',
		description: 'Colorful foliage accent plant for landscaping and indoor décor.',
		features: [
			'Vibrant leaf colors (red, purple, green)',
			'Architectural plant form',
			'Tolerates various light conditions',
			'Hardy and long-lasting',
			'Low maintenance'
		],
		uses: 'Landscape design, container gardens, indoor plant collections, tropical theme',
		care: 'Bright indirect light, well-drained soil, moderate watering.'
	},
	delphinium: {
		name: 'Delphinium',
		image: 'assets/images/delphinium.jpg',
		description: 'Tall flowering perennial with stunning blue/purple spikes.',
		features: [
			'Striking tall flower spikes',
			'Rich blue and purple hues',
			'Excellent cut flower variety',
			'Long flowering season',
			'Attracts pollinators'
		],
		uses: 'Cut flower production, ornamental gardens, floral arrangements, landscaping',
		care: 'Full sun, well-drained soil, support staking. Water regularly during growth.'
	},
	ficus: {
		name: 'Ficus',
		image: 'assets/images/ficus.jpg',
		description: 'Indoor tree-form plant for living spaces and offices.',
		features: [
			'Natural tree-like structure',
			'Glossy green foliage',
			'Air-purifying abilities',
			'Tolerates low light',
			'Easy to maintain'
		],
		uses: 'Office plants, living room décor, commercial landscaping, indoor forestation',
		care: 'Indirect light, moderate watering, occasional misting. Rotate for even growth.'
	},
	gentiana: {
		name: 'Gentiana',
		image: 'assets/images/gentiana.jpg',
		description: 'Alpine blue flowering plant with premium ornamental value.',
		features: [
			'Brilliant deep blue flowers',
			'Compact alpine form',
			'Long flowering period',
			'Hardy perennial',
			'Excellent for border plantings'
		],
		uses: 'Alpine gardens, flower beds, container gardens, ornamental landscaping',
		care: 'Well-drained soil, full sun, cool temperature. Water during dry spells.'
	},
	ginger: {
		name: 'Ginger',
		image: 'assets/images/ginger.jpg',
		description: 'Disease-free ginger rhizomes for commercial cultivation.',
		features: [
			'High-quality disease-free rhizomes',
			'Superior germination rate',
			'Good rhizome yield',
			'Resistance to common diseases',
			'Tissue culture propagated'
		],
		uses: 'Commercial ginger farming, spice production, export cultivation, organic farming',
		care: 'Moist soil, partial shade, regular irrigation. Harvest at 8-10 months. Mulch beds.'
	}
};

document.addEventListener('DOMContentLoaded', function () {
	const modal = document.getElementById('productModal');
	const modalBody = document.getElementById('modalBody');
	const modalClose = document.querySelector('.modal-close');
	const detailButtons = document.querySelectorAll('.btn-details');

	detailButtons.forEach(btn => {
		btn.addEventListener('click', function () {
			const productKey = this.getAttribute('data-product');
			const product = productData[productKey];

			if (product) {
				modalBody.innerHTML = `
					<img src="${product.image}" alt="${product.name}" />
					<h2>${product.name}</h2>
					<p>${product.description}</p>
					
					<h3>Key Features</h3>
					<ul>
						${product.features.map(f => `<li>${f}</li>`).join('')}
					</ul>

					<h3>Uses & Application</h3>
					<p>${product.uses}</p>

					<h3>Care & Management</h3>
					<p>${product.care}</p>

					<p style="margin-top: 1.5rem; color: var(--accent); font-weight: 600;">
						For bulk orders or customized arrangements, <a href="contact.html" style="color: var(--accent); text-decoration: underline;">contact us</a>.
					</p>
				`;
				modal.classList.add('show');
			}
		});
	});

	modalClose.addEventListener('click', function () {
		modal.classList.remove('show');
	});

	window.addEventListener('click', function (e) {
		if (e.target === modal) {
			modal.classList.remove('show');
		}
	});
});
