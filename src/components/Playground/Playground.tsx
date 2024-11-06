import {
  ITokenSelectItem,
  TokenSelect,
} from '../shared/TokenSelect/TokenSelect';
import cloneDeep from 'lodash/cloneDeep';
import { useState } from 'react';
import { TokenSelectMock } from '../../mockData/tokenSelect.mock';

const tokenSelectMock = new TokenSelectMock();
const initList = tokenSelectMock.categories().init;
const newList = tokenSelectMock.categories().new;

const childCount = 4;

export const Playground = () => {
  const [partIndex, setPartIndex] = useState(0);
  const [state, setState] = useState<ITokenSelectItem[]>([]);

  const fetchItems = (id?: string): Promise<ITokenSelectItem[]> => {
    return new Promise((resolve) => {
      const clone = cloneDeep(newList);
      const newCategories = clone.slice(partIndex, partIndex + childCount);
      setPartIndex((p) => p + childCount);

      setTimeout(() => {
        if (id) {
          resolve(newCategories);
        } else {
          resolve(initList);
        }
      }, 200);
    });
  };

  const handleChange = (values: ITokenSelectItem[]) => {
    setState(values);
  };

  return (
    <div style={{ padding: 50 }}>
      <TokenSelect
        tokens={state}
        onChange={handleChange}
        fetchItems={fetchItems}
      />
    </div>
  );
};
