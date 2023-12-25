import { useEffect, useState } from "react";
import { IncomeCategory } from "../../../types";

interface createIncomeProps {
  showDialog: boolean;
  setShowDialog: any;
}

export default function CreateIncome({
  showDialog,
  setShowDialog,
}: createIncomeProps) {
  const [incomeCategories, setIncomeCategories] = useState<
    IncomeCategory[] | null
  >(null);

  const [amount, setAmount] = useState("");
  const [incomeCategoryId, setIncomeCategoryId] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      amount,
      category: incomeCategoryId,
      details: details,
    });
    fetch("http://localhost:3001/incomes", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        incomeCategoryId: Number(incomeCategoryId),
        details: details,
        date: new Date().toISOString(),
      }),
    });
  };

  useEffect(() => {
    const getAllIncomes = async () => {
      const response = await fetch("http://localhost:3001/income-categories");
      const data = await response.json();
      setIncomeCategories(data);
    };
    getAllIncomes();
  }, []);

  function closeDialog() {
    setShowDialog(!showDialog);
  }

  return (
    <div
      className="dialog-backdrop"
      style={{
        display: showDialog ? "grid" : "none",
        opacity: showDialog ? 1 : 0,
      }}
    >
      <form onSubmit={handleSubmit} className="dialog-content">
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Category:
          <select
            id="category"
            name="category"
            value={incomeCategoryId}
            onChange={(e) => setIncomeCategoryId(e.target.value)}
          >
            {incomeCategories &&
              incomeCategories.map((incomeCat) => (
                <option key={incomeCat.id} value={incomeCat.id}>
                  {incomeCat.icon}
                  {incomeCat.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Details:
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>
        <button type="submit">submit</button>
        <button className="close-button" onClick={closeDialog}>
          X
        </button>
      </form>
    </div>
  );
}