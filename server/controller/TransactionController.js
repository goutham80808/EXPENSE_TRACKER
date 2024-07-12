import Transaction from "../models/Transaction.js";

export const index = async (req, res) => {
  const transaction = await Transaction.aggregate([
    {
      $match: { user_id: req.user._id },
    },
    {
      $group: {
        _id: { $month: "$date" },
        transactions: {
          $push: {
            amount: "$amount",
            description: "$description",
            date: "$date",
            _id: "$_id",
            category_id: "$category_id",
          },
        },
        totalExpenses: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json({ data: transaction });
};

export const create = async (req, res) => {
  const { amount, description, date, category_id } = req.body;
  const transaction = new Transaction({
    amount,
    description,
    user_id: req.user._id,
    date,
    category_id,
  });
  await transaction.save();
  res.json({ message: "Success" });
};

export const destroy = async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.id });
  res.json({ message: "Success" });
};

export const update = async (req, res) => {
  await Transaction.updateOne({ _id: req.params.id }, { $set: req.body });
  res.json({ message: "Success" });
};

export const sort = async (req, res) => {
  try {
    const { sortBy } = req.params;

    let sortCriteria;
    switch (sortBy) {
      case 'amountAsc':
        sortCriteria = { amount: 1 };
        break;
      case 'amountDesc':
        sortCriteria = { amount: -1 };
        break;
      case 'dateAsc':
        sortCriteria = { date: 1 };
        break;
      case 'dateDesc':
        sortCriteria = { date: -1 };
        break;
      default:
        sortCriteria = {};
        break;
    }

    const transactions = await Transaction.find().sort(sortCriteria);
    res.status(200).json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};