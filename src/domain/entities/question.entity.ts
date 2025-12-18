export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    weight: number;
  }[];
}
