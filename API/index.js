const express = require("express");
const mongoose = require("mongoose");
const SeedApiRouter = require("./SeedApi/Seed-Api");
const VendorApiRouter = require("./VendorApi/Vendor-Api");
const InventoryApiRouter = require("./VendorSeedInventory/VendorSeed-Api");
const OrderApiRouter = require("./OrderSeedApi/orderapi");
const TransportApiRouter = require("./TransportAPI/Transport-Api");
const SubsidyApiRouter = require("./SubsidyApi/Subsidy-Api");

const bodyParser = require("body-parser");
const cors = require("cors");

const url =
  "mongodb+srv://malvihiten8842:malvihiten8842@cluster0.sqors.mongodb.net/GrocKO";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to atlas !");
    const express = require("express");
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());

    // Use routes
    app.use("/seedapi", SeedApiRouter);
    app.use("/vendorapi", VendorApiRouter);
    app.use("/inventoryapi", InventoryApiRouter);
    app.use("/orderapi", OrderApiRouter);
    app.use("/transportapi", TransportApiRouter);
    app.use("/subsidyapi", SubsidyApiRouter);

    app.listen(3030, () => {
      console.log("Server started at port 3030 !");
    });
  });
