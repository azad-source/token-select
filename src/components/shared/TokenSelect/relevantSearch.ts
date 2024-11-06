import { ITokenSelectDropdownItem } from './models';

interface SearchResult extends ITokenSelectDropdownItem {
  relevance?: number;
}

function getRelevance(item: ITokenSelectDropdownItem, searchQuery: string) {
  const nameLower = item.label.toLowerCase();
  const searchQueryLower = searchQuery.toLowerCase();
  const index = nameLower.indexOf(searchQueryLower);

  if (index === 0) {
    return 3;
  } else if (index > 0 && index < nameLower.length - searchQueryLower.length) {
    return 2;
  } else if (index > 0) {
    return 1;
  } else {
    return 0;
  }
}

function setHide(
  items: ITokenSelectDropdownItem[],
  query: string
): ITokenSelectDropdownItem[] {
  return items.map((item) => {
    if (item.children?.length) {
      item.children = setHide(item.children, query);
    }

    return item;
  });
}

export function getSearchResult(
  items: ITokenSelectDropdownItem[],
  searchQuery?: string
): SearchResult[] {
  const query = searchQuery?.trim() || '';

  const filtered = setHide(items, query);
  const list = [];

  for (const item of filtered) {
    list.push({ ...item, relevance: getRelevance(item, query) });
  }

  return list
    .sort((a, b) => b.relevance - a.relevance)
    .filter((i) => i.relevance !== 0);
}
