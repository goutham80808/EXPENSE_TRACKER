import mongoose from "mongoose";

async function connect() {
  const username = process.env.MONGO_DB_USERNAME;
  const password = process.env.MONGO_DB_PASSWORD;
  // const url = process.env.MONGO_DB_URL;
  mongoose.set('strictQuery', true);

  await mongoose
    .connect(
      `mongodb+srv://${username}:${password}@cluster0.sozwikv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => console.log("MongoDB connection is successful"));
}

export default connect;
