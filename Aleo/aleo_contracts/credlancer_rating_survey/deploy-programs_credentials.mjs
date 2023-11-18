import { readFile } from "fs/promises";
import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  AleoKeyProvider,
} from "@aleohq/sdk";

const deploy = async () => {
  try {
    const ALEO_NETWORK_URL = process.env.VITE_NETWORK_URL;
    const ALEO_PRIVATE_KEY = process.env.VITE_PRIVATE_KEY;
    const ALEO_PROGRAM_NAME = process.env.VITE_PROGRAM_NAME;

    if (!ALEO_NETWORK_URL || !ALEO_PRIVATE_KEY || !ALEO_PROGRAM_NAME) {
      throw new Error("Missing env variables");
    }

    const account = new Account({ privateKey: ALEO_PRIVATE_KEY });

    console.log(account)

    const keyProvider = new AleoKeyProvider();
    keyProvider.useCache(true);

    const networkClient = new AleoNetworkClient(ALEO_NETWORK_URL);
    const recordProvider = new NetworkRecordProvider(account, networkClient);
    const programManager = new ProgramManager(
      ALEO_NETWORK_URL,
      keyProvider,
      recordProvider
    );

    programManager.setAccount(account);

    const fee = 6.0;
    const program = await readFile(
      "../programs/credentials/build/main.aleo",
      "utf-8"
    ).then((p) => p.replaceAll("credlancer_rating_survey_v3.aleo", ALEO_PROGRAM_NAME));

    const txId = await programManager.deploy(program, fee, false);
    if (txId instanceof Error) {
      console.error(txId);
      return;
    }

    console.log(transaction);

    console.log(
      "Deployment successful"
    );
  } catch (error) {
    console.error(error);
    return;
  }
};

void deploy().then(() => process.exit());
