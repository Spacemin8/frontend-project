import { observer } from 'mobx-react';
import { forwardRef, useCallback, useMemo } from 'react';
import { Block, Elem } from '../../utils/bem';
import { FF_LSDV_4711, isFF } from '../../utils/feature-flags';
import messages from '../../utils/messages';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import './Object3D.styl';

/**
 * Coordinates in relative mode belong to a data domain consisting of percentages in the range from 0 to 100
 */
export const RELATIVE_STAGE_WIDTH = 100;

/**
 * Coordinates in relative mode belong to a data domain consisting of percentages in the range from 0 to 100
 */
export const RELATIVE_STAGE_HEIGHT = 100;

/**
 * Mode of snapping to pixel
 */
export const SNAP_TO_PIXEL_MODE = {
  EDGE: 'edge',
  CENTER: 'center',
};

export const Object3D = observer(forwardRef(({
  imageEntity,
  imageTransform,
  updateObject3DSize,
  usedValue,
  size,
}, ref) => {
  const imageSize = useMemo(() => {
    return {
      width: size.width === 1 ? '100%' : size.width,
      height: size.height === 1 ? 'auto' : size.height,
    };
  }, [size]);

  const onLoad = useCallback((event) => {
    updateObject3DSize(event);
    imageEntity.setObject3DLoaded(true);
  }, [updateObject3DSize, imageEntity]);

  return (
    <Block name="image" style={imageSize}>
      <Object3DProgress
        downloading={imageEntity.downloading}
        progress={imageEntity.progress}
        error={imageEntity.error}
        src={imageEntity.src}
        usedValue={usedValue}
      />
      {imageEntity.downloaded ? (
        <Object3DRenderer
          alt="image"
          ref={ref}
          src={imageEntity.currentSrc}
          onLoad={onLoad}
          isLoaded={imageEntity.imageLoaded}
          imageTransform={imageTransform}
        />
      ) : null}
    </Block>
  );
}));

const Object3DProgress = observer(({
  downloading,
  progress,
  error,
  src,
  usedValue,
}) => {
  return downloading ? (
    <Block name="image-progress">
      <Elem name="message">Downloading image</Elem>
      <Elem tag="progress" name="bar" value={progress} min="0" max={1} step={0.0001}/>
    </Block>
  ) : error ? (
    <Object3DLoadingError src={src} value={usedValue} />
  ) : null;
});

const imgDefaultProps = {};

if (isFF(FF_LSDV_4711)) imgDefaultProps.crossOrigin = 'anonymous';

const Object3DRenderer = observer(forwardRef(({
  src,
  onLoad,
  imageTransform,
  isLoaded,
}, ref) => {
  const imageStyles = useMemo(() => {
    const style = imageTransform ?? {};

    return { ...style, visibility: isLoaded ? 'visible' : 'hidden' };
  }, [imageTransform, isLoaded]);

  return (
    <img
      {...imgDefaultProps}
      ref={ref}
      alt="image"
      src={src}
      onLoad={onLoad}
      style={imageStyles}
    />
  );
}));

const Object3DLoadingError = ({ src, value }) => {
  const error = useMemo(() => {
    return messages.ERR_LOADING_HTTP({
      url: src,
      error: '',
      attr: value,
    });
  }, [src]);

  return (
    <ErrorMessage error={error}/>
  );
};
