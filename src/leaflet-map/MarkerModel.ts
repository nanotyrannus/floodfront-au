export interface MarkerModel {
    created: Date
    description: string
    error_margin: number
    event_id: number
    heading: number
    id: number
    lat: number
    lon: number
    marker_type: MarkerType
}

export enum MarkerType {
    WALKABLE,
    FLOOD,
    BORDER
}