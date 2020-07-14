export default interface YTDataInterface {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  publishedAt: Date;
  channel: {
    title: string;
    type: string;
    url: string;
    id: string;
  };
  thumbnails: {
    default: {
      url: string;
    };
    high: {
      url: string;
    };
    medium: {
      url: string;
    };
  };
}
