const STORAGE_KEY = "sproutlogPlants";

const PLANT_TYPES = [
	{
		id: "fern", name: "Boston fern", article: "Nephrolepis exaltata", group: "Houseplants",
		tips: [
			"Use a rich, peat-free potting mix with compost for steady growth.",
			"Feed with a balanced liquid fertilizer at half strength about once a month while actively growing.",
			"Skip fertilizer in winter and avoid feeding dry or stressed roots."
		]
	},
	{
		id: "monstera", name: "Monstera", article: "Monstera deliciosa", group: "Houseplants",
		tips: [
			"A balanced houseplant fertilizer every 4 to 6 weeks in spring and summer is usually enough.",
			"Use a diluted dose and reduce feeding in fall and winter.",
			"Flush the pot with clean water occasionally to limit fertilizer salt buildup."
		]
	},
	{
		id: "pothos", name: "Golden pothos", article: "Epipremnum aureum", group: "Houseplants",
		tips: [
			"Feed with a balanced liquid fertilizer every 4 to 6 weeks during active growth.",
			"Use a half-strength dose; more fertilizer will not make the plant grow faster.",
			"Pause feeding in winter and when the plant is unwell."
		]
	},
	{
		id: "snake-plant", name: "Snake plant", article: "Dracaena trifasciata", group: "Houseplants",
		tips: [
			"Feed sparingly with a balanced houseplant fertilizer once or twice in spring and summer.",
			"Dilute to half strength; excess nutrients can damage roots.",
			"Do not fertilize during winter dormancy."
		]
	},
	{
		id: "peace-lily", name: "Peace lily", article: "Spathiphyllum wallisii", group: "Houseplants",
		tips: [
			"A balanced liquid fertilizer at half strength every 6 weeks in spring and summer supports growth.",
			"Avoid overfeeding, which can brown leaf tips.",
			"Reduce feeding in the cooler, darker months."
		]
	},
	{
		id: "houseplant", name: "Rubber plant", article: "Ficus elastica", group: "Houseplants",
		tips: [
			"Use a balanced houseplant fertilizer monthly during spring and summer growth.",
			"Follow the label and reduce the dose if leaf tips brown.",
			"Pause feeding in winter when growth slows."
		]
	},
	{
		id: "tomato", name: "Tomato", article: "Solanum lycopersicum", group: "Food plants",
		tips: [
			"Mix compost into the soil before planting; containers need a steady supply of nutrients.",
			"Use a tomato fertilizer as directed once flowering begins, with less nitrogen and more potassium than a leafy-growth feed.",
			"Too much nitrogen can produce lots of leaves but fewer flowers and fruits."
		]
	},
	{
		id: "basil", name: "Basil", article: "Ocimum basilicum", group: "Food plants",
		tips: [
			"Start with compost-rich potting mix; basil usually needs only a light feed.",
			"Use a half-strength balanced fertilizer every 4 to 6 weeks while actively growing.",
			"Avoid heavy feeding, which can make growth soft and reduce flavor."
		]
	},
	{
		id: "lettuce", name: "Lettuce", article: "Lactuca sativa", group: "Food plants",
		tips: [
			"Lettuce is a leafy crop, so prepare the bed with mature compost before sowing.",
			"If growth is slow, use a mild nitrogen-rich feed according to its label.",
			"Keep nutrients steady and avoid concentrated fertilizer touching leaves or roots."
		]
	},
	{
		id: "pepper", name: "Pepper", article: "Capsicum annuum", group: "Food plants",
		tips: [
			"Mix compost into the soil before planting and use a balanced feed while the plant establishes.",
			"Once flowers and fruit appear, switch to a tomato or fruiting-plant fertilizer as directed.",
			"Avoid excess nitrogen after flowering, which can favor leaves over peppers."
		]
	},
	{
		id: "strawberry", name: "Strawberry", article: "Fragaria × ananassa", group: "Food plants",
		tips: [
			"Prepare the soil with compost and use a balanced, low-nitrogen feed in spring.",
			"Follow the fertilizer label for repeat feeding; excess nitrogen can reduce flowering.",
			"Avoid feeding ripe fruit directly and keep fertilizer off the leaves."
		]
	}
];

const DEFAULT_PLANTS = [
	{ id: "fern", name: "Fern", type: "fern", interval: 3, daysAgo: 5 },
	{ id: "monstera", name: "Monstera", type: "monstera", interval: 7, daysAgo: 8 },
	{ id: "pothos", name: "Golden pothos", type: "pothos", interval: 7, daysAgo: 2 },
	{ id: "snake-plant", name: "Snake plant", type: "snake-plant", interval: 14, daysAgo: 6 }
];
