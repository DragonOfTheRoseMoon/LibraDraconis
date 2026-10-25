
export interface ChartSliceInput {

    label: string;
    value: number;
    color: string;

};

export interface ChartSliceComputed extends ChartSliceInput {

    svgPath: string;
    hoverDistX: number;
    hoverDistY: number;

};
