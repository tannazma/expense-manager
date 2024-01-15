import { useContext, useState } from "react";
import FilterContext from "./FilterContext";
import PrimaryButton from "./PrimaryButton";

const FilterDateComponent = () => {
  const { setDateFilter } = useContext(FilterContext);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const getExpenseSumBasedOnDate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (fromDate && toDate) {
      // Ensure fromDate and toDate are in 'YYYY-MM-DD' format
      const from = new Date(fromDate).toISOString().split("T")[0];
      const to = new Date(toDate).toISOString().split("T")[0];
      const convertDate = (dateString: string) => {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month.padStart(2, "0")}/${year}`;
      };
      const fromConverted = convertDate(from);
      const toConverted = convertDate(to);

      setDateFilter({ from: fromConverted, to: toConverted });
    }
  };

  return (
    <div className="flex justify-end pr-8">
      <form onSubmit={getExpenseSumBasedOnDate}>
        <label className="text-xs">
          From
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-1 ml-1"
          />
        </label>
        <label className="text-xs ml-3">
          To
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-1 ml-1"
          />
        </label>
        <PrimaryButton type="submit">Submit</PrimaryButton>
        <div className="text-l min-h-[40px]">
          {fromDate && toDate ? (
            <>
              Date From: <span className="ml-2 mr-4">{fromDate}</span> to:{" "}
              <span className="ml-2">{toDate}</span>
            </>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};
export default FilterDateComponent;
