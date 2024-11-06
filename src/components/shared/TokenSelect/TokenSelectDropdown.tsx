import { useEffect, useRef, useState } from 'react';
import styles from './TokenSelectDropdown.module.scss';
import cx from 'clsx';
import { Button, Checkbox } from '@skbkontur/react-ui';
import { ArrowCDownIcon16Regular } from '@skbkontur/icons/icons/ArrowCDownIcon/ArrowCDownIcon16Regular';
import { ArrowCUpIcon16Regular } from '@skbkontur/icons/icons/ArrowCUpIcon/ArrowCUpIcon16Regular';
import { ITokenSelectDropdownItem } from './models';

interface IProps {
  items: ITokenSelectDropdownItem[];
  selected: Set<string>;
  indeterminated: Set<string>;
  className?: string;
  onSelect: (id: string) => void;
  onUnselect: (id: string) => void;
  fetchItems?: (id: string) => Promise<void>;
}

export const TokenSelectDropdown: React.FC<IProps> = ({
  items,
  selected,
  indeterminated,
  className,
  onSelect,
  onUnselect,
  fetchItems,
}) => {
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.root__list}>
        {items.map((i) => {
          return (
            <Item
              key={i.value}
              item={i}
              items={items}
              selected={selected}
              indeterminated={indeterminated}
              onSelect={onSelect}
              onUnselect={onUnselect}
              fetchItems={fetchItems}
            />
          );
        })}
      </div>
    </div>
  );
};

interface IItemProps {
  item: ITokenSelectDropdownItem;
  items: ITokenSelectDropdownItem[];
  selected: Set<string>;
  indeterminated: Set<string>;
  onSelect: (id: string) => void;
  onUnselect: (id: string) => void;
  fetchItems?: (id: string) => Promise<void>;
}

const Item: React.FC<IItemProps> = ({
  items,
  item,
  selected,
  indeterminated,
  onSelect,
  onUnselect,
  fetchItems,
}) => {
  const ref = useRef<Checkbox>(null);
  const [hidden, setHidden] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const isChecked = [...selected].includes(item.value);

  useEffect(() => {
    if (indeterminated.has(item.value)) {
      ref.current?.setIndeterminate();
    } else {
      ref.current?.resetIndeterminate();
    }
  }, [indeterminated]);

  const handleExpand = () => {
    if (item.isParent && !item.children?.length && hidden && fetchItems) {
      setLoading(true);
      fetchItems(item.value)
        .then(() => setHidden(false))
        .finally(() => setLoading(false));
    } else {
      setHidden((p) => !p);
    }
  };

  const handleSwitch = (item: ITokenSelectDropdownItem) => {
    if (isChecked) {
      onUnselect(item.value);
    } else {
      onSelect(item.value);
    }
  };

  const isPlainTree = items.every((i) => !i.isParent && !i.children?.length);

  return (
    <div className={cx(styles.item, isPlainTree && styles.item_isNotParent)}>
      <div className={styles.item__header}>
        <div className={styles.buttonWrap}>
          {item.isParent && (
            <Button
              icon={<Arrow hidden={hidden} className={styles.arrowIcon} />}
              onClick={handleExpand}
              use="link"
              loading={loading}
            />
          )}
        </div>
        <Checkbox
          checked={isChecked}
          onValueChange={() => handleSwitch(item)}
          ref={ref}
          className={styles.label}
        >
          {item.label}
        </Checkbox>
      </div>
      {!!item.children?.length && !hidden && (
        <div className={styles.item__children}>
          {item.children?.map((i) => {
            return (
              <Item
                key={i.value}
                item={i}
                items={items}
                selected={selected}
                indeterminated={indeterminated}
                onSelect={onSelect}
                onUnselect={onUnselect}
                fetchItems={fetchItems}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const Arrow = ({
  hidden,
  className,
}: {
  hidden: boolean;
  className: string;
}) => {
  return (
    <>
      {hidden ? (
        <ArrowCDownIcon16Regular className={className} />
      ) : (
        <ArrowCUpIcon16Regular className={className} />
      )}
    </>
  );
};
