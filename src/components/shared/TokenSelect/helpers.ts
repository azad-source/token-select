import { Checkbox } from '@skbkontur/react-ui';
import { ITokenSelectItem, ITokenSelectDropdownItem } from './models';
import { cached } from 'utils/cacheFunction/cacheFunction';

/**
 * Проверяет, есть ли хотя бы один выделенный элемент среди указанных.
 *
 * @param items - Список элементов для проверки.
 * @param selected - Множество выделенных элементов.
 * @returns `true`, если хотя бы один элемент из `items` отмечен, иначе `false`.
 */
export function isSomeChecked(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>
): boolean {
  return items.some(
    (i) =>
      has(i, selected) || (i.children && isSomeChecked(i.children, selected))
  );
}

/**
 * Проверяет, все ли элементы из списка отмечены.
 *
 * @param items - Список элементов для проверки.
 * @param selected - Множество выделенных элементов.
 * @returns `true`, если все элементы из `items` отмечены, иначе `false`.
 */
export function isAllChecked(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>
): boolean {
  return items.every(
    (i) =>
      has(i, selected) && (!i.children || isAllChecked(i.children, selected))
  );
}

/**
 * Обновляет дочерние элементы для элемента с заданным `id`.
 *
 * @param id - Идентификатор элемента для обновления.
 * @param items - Список элементов, в которых осуществляется поиск.
 * @param children - Дочерние элементы для обновления.
 * @returns Новый список элементов с обновленными дочерними элементами для заданного `id`.
 */
export function getAddedChildren(
  id: string,
  items: ITokenSelectDropdownItem[],
  children: ITokenSelectDropdownItem[]
): ITokenSelectDropdownItem[] {
  return items.map((i) => {
    if (i.value === id) {
      return { ...i, children, isParent: true };
    } else if (i.children) {
      return { ...i, children: getAddedChildren(id, i.children, children) };
    }

    return i;
  });
}

/**
 * Получает все уникальные идентификаторы элементов, включая дочерние.
 *
 * @param items - Список элементов для поиска.
 * @returns Множество всех уникальных идентификаторов элементов.
 */
export function getAllIds(items: ITokenSelectDropdownItem[]): Set<string> {
  return items.reduce<Set<string>>((acc, item) => {
    acc.add(item.value);
    if (item.children?.length) {
      getAllIds(item.children).forEach((i) => acc.add(i));
    }
    return acc;
  }, new Set());
}

export const getAllIdsCahed = cached(getAllIds);

/**
 * Получает все выбранные элементы.
 *
 * @param items - Список элементов для поиска.
 * @param selected - Множество выбранных идентификаторов.
 * @returns Список выбранных элементов (токенов).
 */
export function getSelectedTokens(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>
): ITokenSelectItem[] {
  return items.reduce<ITokenSelectItem[]>((acc, item) => {
    if (has(item, selected)) {
      const { value, label, isParent, counter } = item;
      acc.push({ value, label, isParent, counter });
      return acc;
    }

    if (item.children?.length) {
      acc.push(...getSelectedTokens(item.children, selected));
    }

    return acc;
  }, []);
}

/**
 * Обновляет состояние "Выделить все" для чекбокса.
 *
 * @param items - Список элементов для проверки.
 * @param selected - Множество выделенных элементов.
 * @param ref - Ссылка на чекбокс для установки состояния.
 */
export function updateCheckAllState(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>,
  ref: React.RefObject<Checkbox>
) {
  if (isSomeChecked(items, selected) && !isAllChecked(items, selected)) {
    ref.current?.setIndeterminate();
    return;
  }
  ref.current?.resetIndeterminate();
}

/**
 * Получает множество идентификаторов всех элементов (токенов) списка.
 *
 * @param tokens - Список элементов (токенов), для которых необходимо получить идентификаторы.
 * @returns Множество идентификаторов элементов.
 */
export function getTokensIds(tokens: ITokenSelectItem[]): Set<string> {
  return new Set(tokens.map((i) => i.value));
}

/**
 * Получает идентификаторы всех дочерних элементов для заданного `id`.
 *
 * @param id - Идентификатор родительского элемента.
 * @param items - Список элементов для поиска.
 * @returns Множество идентификаторов всех дочерних элементов.
 */
function getItemChildrenIds(
  id: string,
  items: ITokenSelectDropdownItem[]
): Set<string> {
  const item = findItem(id, items);

  if (item?.children) {
    return getAllIdsCahed(item.children);
  }

  return new Set();
}

/**
 * Находит элемент по идентификатору.
 *
 * @param id - Идентификатор элемента для поиска.
 * @param items - Список элементов для поиска.
 * @returns Элемент с заданным `id` или `null`, если элемент не найден.
 */
export function findItem(
  id: string,
  items: ITokenSelectDropdownItem[]
): ITokenSelectDropdownItem | null {
  for (const i of items) {
    if (i.value === id) return i;
    const found = i.children && findItem(id, i.children);
    if (found) return found;
  }

  return null;
}

/**
 * Находит элемент по названию.
 *
 * @param label - Название элемента для поиска.
 * @param items - Список элементов для поиска.
 * @returns Элемент с заданным `label` или `null`, если элемент не найден.
 */
export function findItemByLabel(
  label: string,
  items: ITokenSelectDropdownItem[]
): ITokenSelectDropdownItem | null {
  for (const i of items) {
    if (i.label === label) return i;
    const found = i.children && findItemByLabel(label, i.children);
    if (found) return found;
  }

  return null;
}

/**
 * Определяет, какие элементы имеют состояние "частично выбран".
 *
 * @param items - Список элементов для проверки.
 * @param selected - Множество выбранных элементов.
 * @param indeterminated - Множество элементов в состоянии "частично выбран".
 * @returns Множество элементов, находящихся в состоянии "частично выбран".
 */
export function getParentsIndeterminated(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>,
  indeterminated: Set<string>
): Set<string> {
  return items.reduce<Set<string>>((acc, item) => {
    if (item.children?.length) {
      const indeterminatedChildren = getParentsIndeterminated(
        item.children,
        selected,
        indeterminated
      );
      indeterminatedChildren.forEach((i) => acc.add(i));

      const isItemSelected = has(item, selected);
      const isAllChildrenSelected = isAllChecked(item.children, selected);
      const isSomeChildrenCheckedOrIndetermined = item.children.some(
        (i) => has(i, selected) || has(i, indeterminatedChildren)
      );

      if (
        !isItemSelected &&
        isSomeChildrenCheckedOrIndetermined &&
        !isAllChildrenSelected
      ) {
        acc.add(item.value);
      }
    }

    return acc;
  }, new Set());
}

/**
 * Получает множество идентификаторов всех отмеченных элементов, включая дочерние.
 *
 * @param items - Список элементов для проверки.
 * @param selected - Множество выбранных элементов.
 * @param id - Идентификатор элемента для отметки.
 * @returns Множество идентификаторов всех отмеченных элементов.
 */
export function getCheckedIds(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>,
  id: string
): Set<string> {
  const result = new Set<string>([...selected, id]);
  getItemChildrenIds(id, items).forEach((i) => result.add(i));

  function update(items: ITokenSelectDropdownItem[]) {
    items.forEach((item) => {
      if (item.children?.length) {
        update(item.children);
      }

      const isItemChecked = has(item, result);
      const isAllChildrenSelected = item.children?.every((i) => has(i, result));

      if (isItemChecked || isAllChildrenSelected) {
        result.add(item.value);
      }
    });
  }

  update(items);
  return result;
}

/**
 * Проверяет, есть ли среди дочерних элементов невыбранные.
 *
 * @param selected - Множество выбранных элементов.
 * @param items - Дочерние элементы для проверки.
 * @returns `true`, если есть хотя бы один невыбранный элемент, иначе `false`.
 */
function hasUnselectedChild(
  selected: Set<string>,
  items?: ITokenSelectDropdownItem[]
): boolean {
  return !!items?.some((i) => {
    return (
      !has(i, selected) ||
      (!!i.children && hasUnselectedChild(selected, i.children))
    );
  });
}

/**
 * Получает множество идентификаторов всех отмеченных элементов после фильтрации, включая дочерние.
 *
 * @param items - Список элементов для проверки.
 * @param selected - Множество выбранных элементов.
 * @param id - Идентификатор элемента для исключения.
 * @returns Множество идентификаторов всех отмеченных элементов.
 */
export function getUncheckedIds(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>,
  id: string
): Set<string> {
  const result = new Set<string>([]);
  const filtered = new Set([...selected].filter((i) => i !== id));

  function update(items: ITokenSelectDropdownItem[]) {
    for (const item of items) {
      if (item.value === id) continue;

      if (item.children?.length) {
        update(item.children);
      }

      const isItemChecked = has(item, filtered);

      if (isItemChecked && !hasUnselectedChild(filtered, item.children)) {
        result.add(item.value);
      }
    }
  }

  update(items);
  return result;
}

/**
 * Возвращает обновлённое множество выбранных идентификаторов после загрузки дочерних элементов по `id`.
 *
 * @param selected - Множество выбранных элементов.
 * @param children - Список дочерних элементов.
 * @param id - Идентификатор родительского элемента.
 * @returns Обновлённое множество выбранных элементов.
 */
export function getSelectedIdsOnChildrenLoad(
  selected: Set<string>,
  children: ITokenSelectItem[],
  id: string
): Set<string> {
  if ([...selected].includes(id)) {
    return new Set([...selected, ...children.map((i) => i.value)]);
  }
  return selected;
}

/**
 * Переключает состояние выделения всех элементов.
 *
 * @param items - Список элементов для переключения.
 * @param selected - Множество выбранных элементов.
 * @returns Пустое множество, если все элементы уже выбраны, иначе множество всех идентификаторов.
 */
export function getToggledAllSelection(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>
) {
  return isAllChecked(items, selected)
    ? new Set([])
    : new Set(getAllIds(items));
}

function has(item: ITokenSelectDropdownItem, selected: Set<string>) {
  return selected.has(item.value);
}

export function countSelectedItems(
  items: ITokenSelectDropdownItem[],
  selected: Set<string>
): number {
  return items.reduce((count, item) => {
    if (has(item, selected)) return ++count;
    if (item.children) count += countSelectedItems(item.children, selected);
    return count;
  }, 0);
}

export function separateItems(items: ITokenSelectDropdownItem[]): {
  leafItems: ITokenSelectDropdownItem[];
  nonLeafItems: ITokenSelectDropdownItem[];
} {
  const leafItems: ITokenSelectDropdownItem[] = [];
  const nonLeafItems: ITokenSelectDropdownItem[] = [];

  items.forEach((item) => {
    if (item.isParent) {
      nonLeafItems.push(item);
    } else {
      leafItems.push(item);
    }
  });

  return { leafItems, nonLeafItems };
}
