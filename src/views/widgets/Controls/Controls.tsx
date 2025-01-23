import { FC } from 'react';
import classNames from 'classnames';

import styles from './Controls.module.scss';

interface Props {
  className?: string;
  onSave: () => void;
  onLoad: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export const Controls: FC<Props> = (props: Props) => {
  const { className, onSave, onClear, onDelete, onLoad } = props;
  return (
    <div className={classNames(styles.wrapper, className)}>
      <button className={styles.button} id="save" onClick={onSave}>
        SAVE
      </button>
      <button className={styles.button} id="load" onClick={onLoad}>
        LOAD
      </button>
      <button className={styles.button} id="deleteSaved" onClick={onDelete}>
        DELETE SAVED
      </button>
      <button className={styles.button} id="clearField" onClick={onClear}>
        CLEAR FIELD
      </button>
    </div>
  );
};
