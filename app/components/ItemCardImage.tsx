import Image, { ImageProps as NextImageProps } from "next/image";

interface ImageProps extends Omit<NextImageProps, "src"> {
  url: string;
}

const precessImageUrl = (url: string) => {
  if (url.startsWith("https://")) return url;
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return `https:${url}`;
};

export function ItemCardImage({ url, alt, ...props }: ImageProps) {
  return url ? (
    <Image src={precessImageUrl(url)} alt={alt} {...props} />
  ) : (
    <span>{alt}</span>
  );
}
