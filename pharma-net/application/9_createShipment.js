"use strict";

/**
 * This is a Node.JS application to register a new manufacturer on the network.
 */

const fs = require("fs");
const yaml = require("js-yaml");
const { FileSystemWallet, Gateway } = require("fabric-network");
let gateway;
let wallet;
let fabricUserName;
let connectionProfile;

//createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN)
async function main(nameOfOrg, buyerCRN, drugName, listOfAssets, transporterCRN) {
  try {
    const pharmanetContract = await getContractInstance(nameOfOrg);

    console.log(".....Creating a Shipment");
    //console.log("createShipment args : nameOfOrg = " + nameOfOrg + " - buyerCRN = " + buyerCRN + " - drugName = " + drugName + " - ListOfAssets = " + listOfAssets + " - transporterCRN = " + transporterCRN);
    
    const shipmentBuffer = await pharmanetContract.submitTransaction(
      "createShipment",
      buyerCRN,
      drugName,
      listOfAssets,
      transporterCRN
    );

    // process response
    console.log(".....Processing Shipment Transaction Response \n\n");
    console.log("shipment-buffer-output :: " + JSON.stringify(shipmentBuffer.toString()));
    let newShipment = JSON.parse(JSON.stringify(shipmentBuffer.toString()));
    console.log(newShipment);
    console.log("\n\n.....Register New Shipment Transaction Complete!");
    return newShipment;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    // Disconnect from the fabric gateway
    console.log(".....Disconnecting from Fabric Gateway");
    gateway.disconnect();
  }
}

async function getContractInstance(nameOfOrg) {
  // A gateway defines which peer is used to access Fabric network
  // It uses a common connection profile (CCP) to connect to a Fabric Peer
  // A CCP is defined manually in file connection-profile-mhrd.yaml
  gateway = new Gateway();

  if (nameOfOrg === "manufacturer") {
    // A wallet is where the credentials to be used for this transaction exist
    // Credentials for user MHRD_ADMIN was initially added to this wallet.
    wallet = new FileSystemWallet("./identity/manufacturer");

    // What is the username of this Client user accessing the network?
    fabricUserName = "MANUFACTURER_ADMIN";

    // Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
    connectionProfile = yaml.safeLoad(fs.readFileSync("./connection-profile-manufacturer.yaml", "utf8"));
  } else if (nameOfOrg === "distributor") {
    // A wallet is where the credentials to be used for this transaction exist
    // Credentials for user MHRD_ADMIN was initially added to this wallet.
    wallet = new FileSystemWallet("./identity/distributor");

    // What is the username of this Client user accessing the network?
    fabricUserName = "DISTRIBUTOR_ADMIN";

    // Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
    connectionProfile = yaml.safeLoad(fs.readFileSync("./connection-profile-distributor.yaml", "utf8"));
  } else if (nameOfOrg === "transporter") {
    // A wallet is where the credentials to be used for this transaction exist
    // Credentials for user MHRD_ADMIN was initially added to this wallet.
    wallet = new FileSystemWallet("./identity/transporter");

    // What is the username of this Client user accessing the network?
    fabricUserName = "TRANSPORTER_ADMIN";

    // Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
    connectionProfile = yaml.safeLoad(fs.readFileSync("./connection-profile-transporter.yaml", "utf8"));
  } else if (nameOfOrg === "retailer") {
    // A wallet is where the credentials to be used for this transaction exist
    // Credentials for user MHRD_ADMIN was initially added to this wallet.
    wallet = new FileSystemWallet("./identity/retailer");

    // What is the username of this Client user accessing the network?
    fabricUserName = "RETAILER_ADMIN";

    // Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
    connectionProfile = yaml.safeLoad(fs.readFileSync("./connection-profile-retailer.yaml", "utf8"));
  } else if (nameOfOrg === "consumer") {
    // A wallet is where the credentials to be used for this transaction exist
    // Credentials for user MHRD_ADMIN was initially added to this wallet.
    wallet = new FileSystemWallet("./identity/consumer");

    // What is the username of this Client user accessing the network?
    fabricUserName = "CONSUMER_ADMIN";

    // Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
    connectionProfile = yaml.safeLoad(fs.readFileSync("./connection-profile-consumer.yaml", "utf8"));
  }

  // Set connection options; identity and wallet
  let connectionOptions = {
    wallet: wallet,
    identity: fabricUserName,
    discovery: { enabled: false, asLocalhost: true },
  };

  // Connect to gateway using specified parameters
  console.log(".....Connecting to Fabric Gateway");
  await gateway.connect(connectionProfile, connectionOptions);

  // Access certification channel
  console.log(".....Connecting to channel - pharmachannel");
  const channel = await gateway.getNetwork("pharmachannel");

  // Get instance of deployed Certnet contract
  // @param Name of chaincode
  // @param Name of smart contract
  console.log(".....Connecting to Certnet Smart Contract");
  return channel.getContract("pharmanet", "org.pharma-network.pharmanet");
}

module.exports.execute = function(nameOfOrg, buyerCRN, drugName, listOfAssets, transporterCRN) {
  return main(nameOfOrg.toLowerCase(), buyerCRN, drugName, listOfAssets, transporterCRN) 
};
// module.exports.execute = main;
//"registerCompany",buyerCRN, drugName, listOfAssets, transporterCRN;
