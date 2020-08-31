export interface ForecastResult {
    cod: string;
    message: string;
    list: [
        {
            dt: number;
            main: {
                temp: number;
                temp_min: number;
                temp_max: number;
            };
            weather: [ {
                id: number;
                main: string;
                description: string;
            }
        ];
        }
    ];
}
