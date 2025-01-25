export interface ICarousel {
  PHOTOS_CAROUSEL: {
    SRC: string;
    DESCRIPTION: string;
  }[]
  CONFIRME_PRESENCE: {
    TEXT: string;
    URL: string;
  }
  title?: string;
  subtitle?: string;
  arrow?: boolean;
  imgHeight?: string;
  id?: string;
}