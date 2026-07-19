import { forwardRef, useState, type FormEvent, type HTMLAttributes } from 'react';
import { cn, Avatar, Button, Textarea } from '@your-org/design-system';
import type { Author } from '../../types';
import styles from './PostComposer.module.css';

export interface PostComposerProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** The posting user — used for the leading avatar. */
  author: Pick<Author, 'name' | 'avatarSrc'>;
  placeholder?: string;
  submitLabel?: string;
  submitting?: boolean;
  maxLength?: number;
  /** Called with the trimmed text when the composer is submitted. */
  onSubmit: (text: string) => void;
}

export const PostComposer = forwardRef<HTMLFormElement, PostComposerProps>(function PostComposer(
  {
    author,
    placeholder = "What's on your mind?",
    submitLabel = 'Post',
    submitting = false,
    maxLength = 500,
    onSubmit,
    className,
    ...rest
  },
  ref,
) {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const over = trimmed.length > maxLength;
  const canPost = trimmed.length > 0 && !over && !submitting;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canPost) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <form ref={ref} className={cn(styles.composer, className)} onSubmit={handleSubmit} {...rest}>
      <div className={styles.row}>
        <Avatar src={author.avatarSrc} name={author.name} size="md" />
        <Textarea
          className={styles.textarea}
          aria-label="Create a post"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          resize="none"
        />
      </div>
      <div className={styles.footer}>
        <span className={styles.counter} data-over={over ? '' : undefined}>
          {trimmed.length}/{maxLength}
        </span>
        <Button type="submit" variant="primary" size="sm" disabled={!canPost} loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
});
