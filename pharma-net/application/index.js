const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

// Import all function modules
const registerCompanies = require("./6_register_companies");
const addDrug = require("./7_addDrug");
const createPO = require("./8_createPO");
const createShipment = require("./9_createShipment");
const updatedShipment = require("./10_updateShipment");
const retailDrug = require("./11_retailDrug");
const history = require("./12_history");
const currentState = require("./13_currentState");
const NETWORK_IS_DOWN = "no such file or directory";
const MSG_NETWORK_DOWN = "currently blockchain network is down. Pls check peers is running and responding !";

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set("title", "Distributed Drug-Counterfeit Pharma Application");

app.get("/", (req, res) => res.send("Hello User, You have launched distributed drug-counterfeit pharma application"));

app.post("/registerCompany", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  registerCompanies
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg,
      req.body.companyCRN,
      req.body.companyName,
      req.body.location,
      req.body.organisationRole
    )
    .then((newCompany) => {
      console.log("New Company got registered");
      const result = {
        status: "success",
        message: "New Company got registered",
        newCompany: newCompany,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

app.post("/addDrug", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  addDrug
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg,
      req.body.drugName,
      req.body.serialNo,
      req.body.mfgDate,
      req.body.expDate,
      req.body.companyCRN
    )
    .then((newDrug) => {
      console.log("New Drug got registered");
      const result = {
        status: "success",
        message: "New Drug got registered",
        newDrug: newDrug,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

app.post("/createPO", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  createPO
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg, 
      req.body.buyerCRN, 
      req.body.sellerCRN, 
      req.body.drugName, 
      req.body.quantity
    )
    .then((newPurchaseOrder) => {
      console.log("New PO got registered");
      const result = {
        status: "success",
        message: "New PO got registered",
        newPurchaseOrder: newPurchaseOrder,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

app.post("/createShipment", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  createShipment
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg, 
      req.body.buyerCRN, 
      req.body.drugName, 
      req.body.listOfAssets, 
      req.body.transporterCRN
    )
    .then((newShipment) => {
      console.log("New Shipment got registered");
      const result = {
        status: "success",
        message: "New Shipment got registered",
        newShipment: newShipment
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

app.post("/updateShipment", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  updatedShipment
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg, 
      req.body.buyerCRN, 
      req.body.drugName, 
      req.body.transporterCRN,
      req.body.organisationRole
    )
    .then((newUpdatedShipment) => {
      console.log("New Updated Shipment got registered");
      //console.log("newUpdatedShipment => " + JSON.parse(JSON.stringify(newUpdatedShipment)));
      const result = {
        status: "success",
        message: "New Updated Shipment got registered",
        newUpdatedShipment: newUpdatedShipment,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

//async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar)
app.post("/retailDrug", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  retailDrug
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg, 
      req.body.drugName, 
      req.body.serialNo, 
      req.body.retailerCRN, 
      req.body.customerAadhar
    )
    .then((newPurchase) => {
      console.log("New Purchase from customer");
      const result = {
        status: "success",
        message: "New Purchase from customer",
        newPurchase: newPurchase,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

//async viewHistory(ctx, drugName, serialNo)
app.post("/viewHistory", (req, res) => {
  console.log("Inside req=> " + JSON.stringify(req.body.companyCRN));
  history
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg, 
      req.body.drugName, 
      req.body.serialNo
    )
    .then((historyOfDrug) => {
      console.log("historyOfDrug");
      const result = {
        status: "success",
        message: "historyOfDrug",
        historyOfDrug: historyOfDrug,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

//async viewDrugCurrentState(ctx, drugName, serialNo)
app.post("/viewCurrentState", (req, res) => {
  currentState
    .execute(
      req.body.organizationName,
      // req.body.nameOfOrg, 
      req.body.drugName, 
      req.body.serialNo
    )
    .then((currentState) => {
      console.log("currentState");
      const result = {
        status: "success",
        message: "currentState",
        currentState: currentState,
      };
      res.json(result);
    })
    .catch((e) => {
      let cause = "";
      if(String(e).indexOf(NETWORK_IS_DOWN) != -1) {
        cause = MSG_NETWORK_DOWN;
      }
      const result = {
        status: "error",
        message: "Failed",
        error: e,
        reason: cause,
      };
      res.status(500).send(result);
    });
});

app.listen(port, () => console.log(`Distributed Drug-Counterfeit Pharma Application listening on port ${port}!`));
