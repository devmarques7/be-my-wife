export interface ICarousel {
  photos: {
    src: string;
    description: string;
}[]
  title?: string;
  subtitle?: string;
  arrow?: boolean;
  imgHeight?: string;
  id?: string;
}