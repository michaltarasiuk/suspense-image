import Image, {getImageProps, type ImageProps} from 'next/image';
import {use, useSyncExternalStore} from 'react';

const imagePromises = new Map<string, Promise<void>>();

export function SuspenseImage(props: ImageProps) {
  const isSSR = useIsSSR();
  if (isSSR) {
    throw new Error(
      'SuspenseImage must be used on the client side only. ' +
        'Rendering it on the server is not supported.'
    );
  }
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

function useIsSSR() {
  const isSSR = useSyncExternalStore(
    subscribe,
    function getSnapshot() {
      return false;
    },
    function getServerSnapshot() {
      return true;
    }
  );
  return isSSR;
}

function subscribe() {
  return () => {};
}
