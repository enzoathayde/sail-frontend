export interface NavHeaderProps {
  headerDescription: string,
  navTo: string,
  buttonDirection: Direction
}

export enum Direction {
  left = "left",
  right = "right"
}