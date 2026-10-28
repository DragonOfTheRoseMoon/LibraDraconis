import type { UUID } from "node:crypto";

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

export interface FunFacts {

    title: string;
    uuid: string;
    hasImage: boolean;
    year?: number | null;
    pages?: number | null;


}
