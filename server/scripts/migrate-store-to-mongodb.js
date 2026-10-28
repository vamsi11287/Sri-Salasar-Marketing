import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Product } from "../src/models/Product.js";
import { Document } from "../src/models/Document.js";
import { Enquiry } from "../src/models/Enquiry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.join(__dirname, "../data/store.json");

const prepareRecord = (record, Model) => {
  const { id, __v, ...data } = record;
  if (data._id && !mongoose.isValidObjectId(data._id)) {
    delete data._id;
  }
  const validationError = new Model(data).validateSync();
  if (validationError) {
    throw validationError;
  }
  return data;
};

const importCollection = async (name, Model, records) => {
  if (!Array.isArray(records)) {
    throw new Error(`The ${name} value in store.json must be an array.`);
  }

  const existingCount = await Model.estimatedDocumentCount();
  if (existingCount > 0) {
    console.log(`[Migration] Skipped ${name}: MongoDB already contains ${existingCount} records.`);
    return;
  }

  if (records.length === 0) {
    console.log(`[Migration] No ${name} records to import.`);
    return;
  }

  const preparedRecords = records.map((record) => prepareRecord(record, Model));
  const insertedRecords = await Model.insertMany(preparedRecords, { ordered: true });
  console.log(`[Migration] Imported ${insertedRecords.length} ${name} records.`);
};

const migrate = async () => {
  if (!fs.existsSync(storePath)) {
    throw new Error(`Migration source not found: ${storePath}`);
  }

  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  await connectDB();
  await importCollection("products", Product, store.products || []);
  await importCollection("documents", Document, store.documents || []);
  await importCollection("enquiries", Enquiry, store.enquiries || []);
};

migrate()
  .catch((error) => {
    console.error("[Migration error]", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
