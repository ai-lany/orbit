import { forwardRef, type HTMLAttributes } from 'react';
import {
  cn,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Menu,
  Typography,
  type MenuItem,
} from '@your-org/design-system';
import { Heart, Comment, Forward, MoreHorizontal } from 'pixelarticons/react';
import type { PostData } from '../../types';
import { formatCount } from '../../lib/format';
import { PhotoGrid } from '../PhotoGrid';
import styles from './PostCard.module.css';

export interface PostCardProps extends HTMLAttributes<HTMLDivElement> {
  post: PostData;
  onLike?: (post: PostData) => void;
  onComment?: (post: PostData) => void;
  onShare?: (post: PostData) => void;
  onPhotoClick?: (post: PostData, index: number) => void;
  /** Overrides the default "…" menu items. */
  menuItems?: MenuItem[];
}

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(function PostCard(
  { post, onLike, onComment, onShare, onPhotoClick, menuItems, className, ...rest },
  ref,
) {
  const { author, timestamp, content, media, stats, liked } = post;

  const items: MenuItem[] = menuItems ?? [
    { label: 'Copy link' },
    { label: 'Mute' },
    { type: 'separator' },
    { label: 'Report', danger: true },
  ];

  return (
    <Card ref={ref} className={cn(styles.card, className)} {...rest}>
      <CardHeader className={styles.header}>
        <div className={styles.author}>
          <Avatar src={author.avatarSrc} name={author.name} size="md" />
          <div className={styles.identity}>
            <span className={styles.nameRow}>
              <Typography as="span" variant="subtitle2" className={styles.name}>
                {author.name}
              </Typography>
              {author.verified && (
                <Badge tone="accent" variant="soft" size="sm" aria-label="Verified">
                  ✓
                </Badge>
              )}
            </span>
            <Typography as="span" variant="caption" color="muted">
              {author.handle ? `@${author.handle}` : null}
              {author.handle && timestamp ? ' · ' : null}
              {timestamp}
            </Typography>
          </div>
        </div>

        <Menu
          placement="bottom-end"
          items={items}
          trigger={
            <Button variant="ghost" size="sm" iconOnly aria-label="Post actions">
              <MoreHorizontal width={18} height={18} />
            </Button>
          }
        />
      </CardHeader>

      {content ? (
        <CardBody className={styles.body}>
          <Typography as="p" variant="body2" className={styles.content}>
            {content}
          </Typography>
        </CardBody>
      ) : null}

      {media && media.length > 0 ? (
        <div className={styles.media}>
          {media.length === 1 ? (
            <img
              className={styles.singleImage}
              src={media[0]!.src}
              alt={media[0]!.alt ?? ''}
              loading="lazy"
            />
          ) : (
            <PhotoGrid
              photos={media}
              cols={media.length >= 3 ? 3 : 2}
              gap={1}
              onPhotoClick={onPhotoClick ? (_, i) => onPhotoClick(post, i) : undefined}
            />
          )}
        </div>
      ) : null}

      <CardFooter className={styles.footer}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.action}
          aria-pressed={liked || undefined}
          onClick={() => onLike?.(post)}
          leading={
            <span className={styles.likeIcon} data-liked={liked ? '' : undefined}>
              <Heart width={16} height={16} />
            </span>
          }
        >
          {stats ? formatCount(stats.likes) : 'Like'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={styles.action}
          onClick={() => onComment?.(post)}
          leading={<Comment width={16} height={16} />}
        >
          {stats ? formatCount(stats.comments) : 'Comment'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={styles.action}
          onClick={() => onShare?.(post)}
          leading={<Forward width={16} height={16} />}
        >
          {stats ? formatCount(stats.shares) : 'Share'}
        </Button>
      </CardFooter>
    </Card>
  );
});
