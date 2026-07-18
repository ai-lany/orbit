import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn, EmptyState, Skeleton, type SpaceToken } from '@your-org/design-system';
import type { MediaItem } from '../../types';
import styles from './PhotoGrid.module.css';

export interface PhotoGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  photos: MediaItem[];
  /** Number of columns. */
  cols?: number;
  /** Optional cap on rows — renders at most `cols * rows` tiles. */
  rows?: number;
  /** Gap between tiles, as a design-system space token (1–8). */
  gap?: SpaceToken;
  /** CSS `aspect-ratio` value for each tile (e.g. '1', '4/3', '16/9'). */
  aspect?: string;
  loading?: boolean;
  /** Placeholder tiles while loading (defaults to `cols * (rows ?? 2)`). */
  skeletonCount?: number;
  /** Custom node rendered when there are no photos. */
  emptyState?: ReactNode;
  onPhotoClick?: (photo: MediaItem, index: number) => void;
}

export const PhotoGrid = forwardRef<HTMLDivElement, PhotoGridProps>(function PhotoGrid(
  {
    photos,
    cols = 3,
    rows,
    gap = 2,
    aspect = '1',
    loading = false,
    skeletonCount,
    emptyState,
    onPhotoClick,
    className,
    style,
    ...rest
  },
  ref,
) {
  const gridStyle = {
    '--pg-cols': cols,
    '--pg-gap': `var(--space-${gap})`,
    '--pg-aspect': aspect,
    ...style,
  } as CSSProperties;

  if (loading) {
    const count = skeletonCount ?? cols * (rows ?? 2);
    return (
      <div ref={ref} className={cn(styles.grid, className)} style={gridStyle} {...rest}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={styles.tile}>
            <Skeleton variant="rect" className={styles.fill} />
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <>
        {emptyState ?? (
          <EmptyState
            title="No photos yet"
            description="Photos will appear here once they're shared."
          />
        )}
      </>
    );
  }

  const shown = rows ? photos.slice(0, cols * rows) : photos;

  return (
    <div ref={ref} className={cn(styles.grid, className)} style={gridStyle} {...rest}>
      {shown.map((photo, i) => {
        const key = photo.id ?? photo.src;
        const image = (
          <img className={styles.image} src={photo.src} alt={photo.alt ?? ''} loading="lazy" />
        );

        if (onPhotoClick) {
          return (
            <button
              key={key}
              type="button"
              className={styles.tile}
              data-interactive=""
              onClick={() => onPhotoClick(photo, i)}
            >
              {image}
            </button>
          );
        }

        if (photo.href) {
          return (
            <a key={key} href={photo.href} className={styles.tile} data-interactive="">
              {image}
            </a>
          );
        }

        return (
          <div key={key} className={styles.tile}>
            {image}
          </div>
        );
      })}
    </div>
  );
});
