import { forwardRef, useState, type HTMLAttributes } from 'react';
import {
  cn,
  Avatar,
  Badge,
  Button,
  Row,
  Stat,
  Tabs,
  TabList,
  Tab,
  Typography,
} from '@your-org/design-system';
import type { ProfileStats, ProfileUser } from '../../types';
import { formatCount } from '../../lib/format';
import styles from './ProfileHeader.module.css';

export interface ProfileTab {
  value: string;
  label: string;
}

const DEFAULT_TABS: ProfileTab[] = [
  { value: 'posts', label: 'Posts' },
  { value: 'media', label: 'Media' },
  { value: 'likes', label: 'Likes' },
];

export interface ProfileHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  user: ProfileUser;
  stats: ProfileStats;
  tabs?: ProfileTab[];
  /** Controlled active tab. Omit to let the header manage tab state itself. */
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onFollow?: (user: ProfileUser) => void;
  /** Show an "Edit profile" action instead of Follow. */
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}

export const ProfileHeader = forwardRef<HTMLDivElement, ProfileHeaderProps>(
  function ProfileHeader(
    {
      user,
      stats,
      tabs = DEFAULT_TABS,
      activeTab,
      onTabChange,
      onFollow,
      isOwnProfile = false,
      onEditProfile,
      className,
      ...rest
    },
    ref,
  ) {
    const [internalTab, setInternalTab] = useState(tabs[0]?.value ?? 'posts');
    const currentTab = activeTab ?? internalTab;

    const handleTab = (value: string) => {
      if (activeTab === undefined) setInternalTab(value);
      onTabChange?.(value);
    };

    return (
      <div ref={ref} className={cn(styles.header, className)} {...rest}>
        <div
          className={styles.cover}
          data-has-image={user.coverSrc ? '' : undefined}
          style={user.coverSrc ? { backgroundImage: `url(${user.coverSrc})` } : undefined}
        />

        <div className={styles.body}>
          <div className={styles.topRow}>
            <Avatar className={styles.avatar} src={user.avatarSrc} name={user.name} size="xl" />
            <div className={styles.actions}>
              {isOwnProfile ? (
                <Button variant="secondary" onClick={onEditProfile}>
                  Edit profile
                </Button>
              ) : (
                <Button
                  variant={user.isFollowing ? 'secondary' : 'primary'}
                  onClick={() => onFollow?.(user)}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          <div className={styles.identity}>
            <span className={styles.nameRow}>
              <Typography as="h2" variant="h4" className={styles.name}>
                {user.name}
              </Typography>
              {user.verified && (
                <Badge tone="accent" variant="soft" size="sm" aria-label="Verified">
                  ✓
                </Badge>
              )}
            </span>
            <Typography as="span" variant="body2" color="muted">
              @{user.handle}
            </Typography>
          </div>

          {user.bio ? (
            <Typography as="p" variant="body2" className={styles.bio}>
              {user.bio}
            </Typography>
          ) : null}

          <Row gap={5} className={styles.stats}>
            <Stat label="Posts" value={formatCount(stats.posts)} />
            <Stat label="Followers" value={formatCount(stats.followers)} />
            <Stat label="Following" value={formatCount(stats.following)} />
          </Row>

          <Tabs value={currentTab} onChange={handleTab} className={styles.tabs}>
            <TabList>
              {tabs.map((t) => (
                <Tab key={t.value} value={t.value}>
                  {t.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      </div>
    );
  },
);
