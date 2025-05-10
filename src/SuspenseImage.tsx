import Image, {getImageProps, type ImageProps} from 'next/image';
import {use} from 'react';

const imagePromises = new Map<string, Promise<void>>();

export function SuspenseImage(props: ImageProps) {
  const {src} = getImageProps(props).props;
  let imagePromise = imagePromises.get(src);
  if (!imagePromise) {
    const {promise, resolve, reject} = Promise.withResolvers<void>();
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject();
    imagePromises.set(src, (imagePromise = promise));
  }
  use(imagePromise);
  return <Image {...props} />;
}
