import { Dispatch, SetStateAction, createContext } from "react";

const FilterContext = createContext<{
  dateFilter: { from: string; to: string } | null;
  setDateFilter: Dispatch<SetStateAction<{ from: string; to: string } | null>>;
}>({
  dateFilter: null,
  setDateFilter: () => {},
});
export default FilterContext;
