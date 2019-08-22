export const MODELS = [{
    "name": "distance score",
    "description": "scores based on the cosine distance in CDDD space compared to input structure.",
    "desirability": [{"x": 0, "y": 1.0}, {"x": 1, "y": 0}],
    "weight": 100,
    "additional_args": {'query': ''}
},
    {
        "name": "substructure match",
        "description": "check for presence of substructure.",
        "desirability": [{"x": 0, "y": 0}, {"x": 1, "y": 1}],
        "weight": 100,
        "additional_args": {'query': ''}
    }, {
        "name": "substructure exclusion",
        "description": "check for absence of substructure.",
        "desirability": [{"x": 0, "y": 1}, {"x": 1, "y": 0}],
        "weight": 100,
        "additional_args": {'query': ''}
    }, {
        "name": "QED",
        "description": "Chemical beauty as defined by Bickerton et al.",
        "desirability": [{"x": 0.3, "y": 0.0}, {"x": 0.6, "y": 0.65}, {"x": 0.7, "y": 0.8}, {"x": 0.8, "y": 0.9}, {
            "x": 0.9,
            "y": 0.95
        }, {"x": 1.0, "y": 1.0}],
        "weight": 100,
    },
    {
        "name": "SA",
        "description": "synthetic accessibility from RDkit.",
        "desirability": [{"x": 2, "y": 1.0}, {"x": 2.5, "y": 0.95}, {"x": 3, "y": 0.8}, {"x": 5, "y": 0}],
        "weight": 100,
    },
    {
        "name": "permeability",
        "description": "Caco-2 permeability.",
        "desirability": [{"x": 0.5, "y": 0.0}, {"x": 1.5, "y": 0.7}, {"x": 1.7, "y": 0.85}, {
            "x": 1.85,
            "y": 0.95
        }, {"x": 2.1, "y": 1.0}],
        "weight": 100,
    },
    {
        "name": "Solubility",
        "description": "solubility determined from powder.",
        "desirability": [{"x": 0, "y": 0.0}, {"x": 1, "y": 0.6}, {"x": 1.5, "y": 0.8}, {"x": 2, "y": 0.9}, {
            "x": 2.5,
            "y": 0.99
        }, {"x": 3.0, "y": 1.0}],
        "weight": 100,
    },
    {
        "name": "Metabolic_stability",
        "description": "good stuff",
        "desirability": [{"x": -2, "y": 0}, {"x": 0, "y": 0.7}, {"x": 0.3, "y": 0.85}, {"x": 0.6, "y": 0.95}, {
            "x": 0.8,
            "y": 1.0
        }],
        "weight": 100,
    },
    {
        "name": "BACE1",
        "description": "arbitratry biological activity from Stamford et al",
        "desirability": [{"x": 2, "y": 0.0}, {"x": 7, "y": 0.6}, {"x": 8, "y": 0.8}, {"x": 9, "y": 0.9}, {
            "x": 10,
            "y": 0.95
        }, {"x": 11, "y": 1}],
        "weight": 100,
    },
    {
        "name": "EGFR",
        "description": "second arbitrary biological activity.",
        "desirability": [{"x": 2, "y": 0.0}, {"x": 7, "y": 0.6}, {"x": 8, "y": 0.8}, {"x": 9, "y": 0.9}, {
            "x": 10,
            "y": 0.95
        }, {"x": 11, "y": 1}],
        "weight": 100,
    },
    {
        "name": "heavy atom count",
        "description": "check for heavy atom count.",
        "desirability": [{"x": 0, "y": 0}, {"x": 25, "y": 1}, {"x": 30, "y": 0.9}, {"x": 40, "y": 0}],
        "weight": 100,
    }];


export const ATTRACTIVENESS_SCORE = {
    "name": "user score",
    "description": "the user score is generated based on the provided user feedback.",
    "desirability": [{"x": 0, "y": 0}, {"x": 1, "y": 1}],
    "weight": 100,
    "additional_args": {"good": [], "bad": []}
}