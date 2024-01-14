import { Dispatch, SetStateAction, createContext } from "react";

const FilterContext = createContext<{
  dateFilter: { from: string; to: string };
  setDateFilter: Dispatch<SetStateAction<{ from: string; to: string }>>;
}>({
  dateFilter: { from: "", to: "" },
  setDateFilter: () => {},
});
export default FilterContext;
