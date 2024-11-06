import {
  Button,
  Checkbox,
  DropdownMenu,
  PopupPositionsType,
  TokenInput,
  TokenProps,
} from '@skbkontur/react-ui';
import styles from './TokenSelect.module.scss';
import cx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { ColoredToken, TokenColorScheme } from '../ColoredToken/ColoredToken';
import { TokenSelectDropdown } from './TokenSelectDropdown';
import { useDebouncedCallback } from 'hooks/useDebounce';
import {
  getSelectedTokens,
  getTokensIds,
  getAddedChildren,
  getParentsIndeterminated,
  isAllChecked,
  updateCheckAllState,
  getCheckedIds,
  getUncheckedIds,
  getSelectedIdsOnChildrenLoad,
  getToggledAllSelection,
  countSelectedItems,
  findItemByLabel,
} from './helpers';
import { ITokenSelectDropdownItem, ITokenSelectItem } from './models';

interface IProps {
  tokens: ITokenSelectItem[];
  tokenColor?: TokenColorScheme;
  width?: number;
  menuMaxHeight?: number;
  dropdownPos?: PopupPositionsType[];
  placeholder?: string;
  className?: string;
  fetchItems: (id?: string) => Promise<ITokenSelectItem[]>;
  searchItems: (query: string) => Promise<ITokenSelectItem[]>;
  onChange: (tokens: ITokenSelectItem[]) => void;
}

export const TokenSelect: React.FC<IProps> = ({
  tokens,
  tokenColor = 'blueDark',
  width = 500,
  menuMaxHeight = 250,
  dropdownPos = ['top center', 'bottom center'],
  placeholder,
  className,
  fetchItems,
  searchItems,
  onChange,
}) => {
  const dropdownRef = useRef<DropdownMenu>(null);
  const checkAllRef = useRef<Checkbox>(null);
  const inputRef = useRef<TokenInput>(null);

  const [items, setItems] = useState<ITokenSelectDropdownItem[]>([]);
  const [initResult, setInitResult] = useState<ITokenSelectDropdownItem[]>([]);
  const [searchResult, setSearchResult] = useState<ITokenSelectDropdownItem[]>(
    []
  );
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const [indeterminated, setIndeterminated] = useState<Set<string>>(
    new Set([])
  );
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setSelected(getTokensIds(tokens));
    fetchItems().then((res) => {
      setInitResult(res);
      setItems(res);
    });
  }, []);

  useEffect(() => {
    if (inputRef.current && dropdownOpened) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [dropdownOpened]);

  useEffect(() => {
    if (searchResult.length > 0) {
      setItems(searchResult);
    }
  }, [searchResult]);

  useEffect(() => {
    updateCheckAllState(items, selected, checkAllRef);
  }, [items, selected]);

  useEffect(() => {
    setIndeterminated(
      getParentsIndeterminated(items, selected, indeterminated)
    );
  }, [selected]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setItems(initResult);
    }
  }, [inputValue, searchResult]);

  const handleSelect = (id: string) => {
    setSelected(getCheckedIds(items, selected, id));
  };

  const handleUnselect = (id: string) => {
    setSelected(getUncheckedIds(items, selected, id));
  };

  const handleFetch = async (id: string): Promise<void> => {
    const children = await fetchItems(id);
    setItems(getAddedChildren(id, items, children));
    setSelected(getSelectedIdsOnChildrenLoad(selected, children, id));
  };

  const toggleSelectAll = () => {
    setSelected(getToggledAllSelection(items, selected));
  };

  const handleRemoveToken = (id: string) => {
    handleUnselect(id);
    onChange(tokens.filter((t) => t.value !== id));
  };

  const handleUpdate = () => {
    onChange(getSelectedTokens(items, selected));
  };

  const handleOpenDropdown = () => {
    setDropdownOpened(true);
    setSelected(getTokensIds(tokens));
    updateCheckAllState(items, selected, checkAllRef);
  };

  const handleCloseDropdown = () => {
    setDropdownOpened(false);
  };

  const handleAdd = () => {
    handleUpdate();
    setInputValue('');
    dropdownRef.current?.close();
    inputRef.current?.reset();
  };

  const handleCancel = () => {
    dropdownRef.current?.close();
    inputRef.current?.reset();
  };

  const onSearch = useDebouncedCallback(async (value: string) => {
    const children = await searchItems(value);
    setSearchResult(children);
  }, 500);

  const handleSearchInput = (value: string) => {
    setInputValue(value);
    if (value.length > 3) {
      onSearch(value);
    }
  };

  const handleFocus = () => {
    dropdownRef.current?.open();
  };

  const selectedCount = countSelectedItems(items, selected);

  return (
    <>
      <InputField
        width={width}
        tokens={tokens}
        color={tokenColor}
        placeholder={placeholder}
        ref={inputRef}
        onFocus={handleFocus}
        onValueChange={handleSearchInput}
        onRemoveToken={handleRemoveToken}
      />
      <DropdownMenu
        ref={dropdownRef}
        menuMaxHeight={menuMaxHeight}
        menuWidth={width}
        width={width}
        className={cx(styles.root, className)}
        onClose={handleCloseDropdown}
        onOpen={handleOpenDropdown}
        positions={dropdownPos}
        caption={() => <></>}
        header={
          <Checkbox
            ref={checkAllRef}
            onClick={toggleSelectAll}
            checked={isAllChecked(items, selected)}
            className={styles.dropdownHeader__checkbox}
          >
            Выбрать все
          </Checkbox>
        }
        footer={
          <DropdownFooter
            selectedCount={selectedCount}
            onAdd={handleAdd}
            onReset={handleCancel}
          />
        }
      >
        <TokenSelectDropdown
          selected={selected}
          indeterminated={indeterminated}
          items={items}
          fetchItems={handleFetch}
          onSelect={handleSelect}
          onUnselect={handleUnselect}
        />
      </DropdownMenu>
    </>
  );
};

interface IInputFieldProps {
  tokens: ITokenSelectItem[];
  color: TokenColorScheme;
  width?: number;
  placeholder?: string;
  onFocus: () => void;
  onValueChange: (value: string) => void;
  onRemoveToken: (label: string) => void;
}

const InputField = forwardRef<TokenInput, IInputFieldProps>(
  (
    {
      tokens,
      color,
      width,
      placeholder,
      onFocus,
      onValueChange,
      onRemoveToken,
    },
    ref
  ) => {
    const handleRemoveToken = (label: string) => {
      const token = findItemByLabel(label, tokens);
      if (token) {
        onRemoveToken(token.value);
      }
    };

    return (
      <TokenInput
        getItems={() => Promise.resolve([])}
        placeholder={placeholder}
        selectedItems={tokens.map((i) => i.label)}
        renderToken={(label: string, props: Partial<TokenProps>) => {
          const itemCount = findItemByLabel(label, tokens)?.counter;
          return renderToken(color, handleRemoveToken)(label, props, itemCount);
        }}
        ref={ref}
        width={width}
        className={styles.tokenInput}
        onFocus={onFocus}
        onInputValueChange={onValueChange}
      />
    );
  }
);

interface IDropdownFooterProps {
  selectedCount: number;
  onAdd: () => void;
  onReset: () => void;
}

const DropdownFooter: React.FC<IDropdownFooterProps> = ({
  selectedCount,
  onAdd,
  onReset,
}) => {
  return (
    <div className={styles.dropdownFooter}>
      <div>Выбрано позиций: {selectedCount}</div>
      <Button
        borderless
        className={styles.dropdownFooter__cancelButton}
        onClick={onReset}
      >
        Отменить
      </Button>
      <Button use="primary" onClick={onAdd}>
        Добавить
      </Button>
    </div>
  );
};

const renderToken =
  (color: TokenColorScheme, onRemove: (label: string) => void) =>
  (label: string, props: Partial<TokenProps>, itemCount?: number) => {
    return (
      <ColoredToken
        {...props}
        key={label.toString()}
        colorScheme={color}
        onRemove={() => onRemove(label)}
      >
        <div className={styles.token}>
          <div>{label}</div>
          {itemCount && (
            <div className={styles.token__counter}>{itemCount}</div>
          )}
        </div>
      </ColoredToken>
    );
  };
