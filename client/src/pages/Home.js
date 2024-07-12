import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, TextField } from "@mui/material";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Cookies from "js-cookie";
import TransactionChart from "../components/TransactionChart";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState({});
  const [initialBalance, setInitialBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const calculateCurrentBalance = () => {
    const balance = transactions.reduce(
      (acc, item) => acc + item.totalExpenses,
      initialBalance
    );
    setCurrentBalance(balance);
  };

  useEffect(() => {
    calculateCurrentBalance();
  }, [transactions, initialBalance]);

  async function fetchTransactions() {
    const token = Cookies.get("token");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await res.json();
    if (Array.isArray(data)) {
      setTransactions(data);
    } else {
      setTransactions([]); // fallback to empty array if data is not an array
    }
  }  

  async function sortTransactions(sortBy) {
    const token = Cookies.get("token");
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/sort/${sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data } = await res.json();
    setTransactions(data);
  }
  

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TransactionForm
            fetchTransactions={fetchTransactions}
            editTransaction={editTransaction}
            setEditTransaction={setEditTransaction}
            sortTransactions={sortTransactions} // Pass sortTransactions function
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <TransactionList
            data={transactions}
            fetchTransactions={fetchTransactions}
            setEditTransaction={setEditTransaction}
            editTransaction={editTransaction}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>
            Current Balance: {currentBalance} ₹
          </Typography>
          <TextField
            label="Initial Balance"
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <TransactionChart
            data={transactions}
            initialBalance={initialBalance}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
