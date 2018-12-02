export function unique(list) {
  return list.reduce((finalList, currentItem, index, all) => {
    if (currentItem !== all[index - 1]) {
      return [...finalList, currentItem];
    }
    return finalList;
  }, []);
}
