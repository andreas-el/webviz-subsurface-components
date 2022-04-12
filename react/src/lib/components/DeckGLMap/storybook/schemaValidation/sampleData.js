export const sampleLogData = [
    {
        header: {
            name: "EcoScope Data",
            well: "35/12-6S",
            source: "Converted from LIS by Log Studio 4.87 - Petroware AS",
            operator: "Logtek Petroleum",
            startIndex: 2907,
            endIndex: 2908,
            step: 1,
        },
        curves: [
            {
                _wrongName: "MD",
                description: "Measured depth",
                quantity: "length",
                unit: "m",
                valueType: "float",
                dimensions: 1,
            },
            {
                name: "A40H",
                description: "Attenuation resistivity 40 inch",
                quantity: "electrical resistivity",
                unit: "ohm.m",
                valueType: "float",
                dimensions: 1,
            },
        ],
        data: [
            [2907, 29.955],
            [2908, 27.733],
        ],
    },
];

export const sampleWellsData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                _wrongType: "GeometryCollection",
                geometries: [
                    {
                        type: "Point",
                        coordinates: [437506.854656, 6477887.47091],
                    },
                    {
                        type: "LineString",
                        coordinates: [
                            [437506.85465554806, 6477887.47091465, 25.0],
                            [
                                437505.96268892975, 6477887.532817844,
                                -83.9951103268622,
                            ],
                            [
                                437505.8497621946, 6477887.5323076015,
                                -97.94448791185415,
                            ],
                        ],
                    },
                ],
            },
            properties: {
                name: "15/9-19 A",
                color: [28, 255, 12, 255],
                md: [[0.0, 109.0, 122.94999694824219]],
            },
        },
    ],
};

export const samplePieData = {
    pies: [
        {
            x: 433600,
            y: 6477600,
            R: 100,
            fractions: [
                { value: 99, idx: 0 },
                { value: "65", idx: 1 },
                { value: 67, idx: 2 },
            ],
        },
    ],

    properties: [
        { color: [255, 0, 0], label: "oil" },
        { color: [0, 0, 255], label: "water" },
        { color: [0, 255, 0], label: "gas" },
    ],
};