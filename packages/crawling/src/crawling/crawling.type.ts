export type PV = {
  service: string;
  pvType: string;
  url: string;
  pvId: string;
  publishDate: string;
  disabled: boolean;
} & Record<string, any>;

export type VocaDBResponse = {
  id: number;
  artistString: string;
  defaultName: string;
  pvs: PV[];
  publishDate: string;
  ratingScore: number;
} & Record<string, any>;
