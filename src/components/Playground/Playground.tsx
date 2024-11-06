import { ITokenSelectItem } from '../shared/TokenSelect/models';
import { TokenSelect } from '../shared/TokenSelect/TokenSelect';
import cloneDeep from 'lodash/cloneDeep';
import { useState } from 'react';
import { TokenSelectMock } from '../../mockData/tokenSelect.mock';
import { getSearchResult } from 'components/shared/TokenSelect/relevantSearch';
import { separateItems } from 'components/shared/TokenSelect/helpers';

const tokenSelectMock = new TokenSelectMock();
const categories = tokenSelectMock.categories();

const initCount = 5;
const childCount = 4;

const searchItems = (query: string): Promise<ITokenSelectItem[]> => {
  return new Promise((resolve) => {
    const clone = cloneDeep(categories);
    const filterdItems = getSearchResult(clone, query);

    const sorted = separateItems(filterdItems);

    setTimeout(() => {
      resolve([...sorted.nonLeafItems, ...sorted.leafItems]);
    }, 200);
  });
};

export const Playground = () => {
  const [partIndex, setPartIndex] = useState(initCount);
  const [state, setState] = useState<ITokenSelectItem[]>([]);

  const fetchItems = (id?: string): Promise<ITokenSelectItem[]> => {
    return new Promise((resolve) => {
      const clone = cloneDeep(categories);
      const newCategories = clone.slice(partIndex, partIndex + childCount);
      setPartIndex((p) => p + childCount);

      setTimeout(() => {
        if (id) {
          resolve(newCategories);
        } else {
          resolve(newCategories.slice(0, initCount));
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
        menuMaxHeight={300}
        onChange={handleChange}
        fetchItems={fetchItems}
        searchItems={searchItems}
      />
    </div>
  );
};
