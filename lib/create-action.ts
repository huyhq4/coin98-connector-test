import { BN } from 'bn.js';
import * as nearAPI from 'near-api-js';
const { transactions, utils } = nearAPI;

const getAccessKey = (permission: any) => {
  if (permission === 'FullAccess') {
    return transactions.fullAccessKey();
  }

  const { receiverId, methodNames = [] } = permission;
  const allowance = permission.allowance ? new BN(permission.allowance) : undefined;

  return transactions.functionCallAccessKey(receiverId, methodNames, allowance as unknown as bigint);
};

export const createAction = (action: any) => {
  switch (action.type) {
    case 'CreateAccount':
      return transactions.createAccount();
    case 'DeployContract': {
      const { code } = action.params;

      return transactions.deployContract(code);
    }
    case 'FunctionCall': {
      const { methodName, args, gas, deposit } = action.params;

      return transactions.functionCall(
        methodName,
        args,
        new BN(gas) as unknown as bigint,
        new BN(deposit) as unknown as bigint,
      );
    }
    case 'Transfer': {
      const { deposit } = action.params;

      return transactions.transfer(new BN(deposit) as unknown as bigint);
    }
    case 'Stake': {
      const { stake, publicKey } = action.params;

      return transactions.stake(new BN(stake) as unknown as bigint, utils.PublicKey.from(publicKey));
    }
    case 'AddKey': {
      const { publicKey, accessKey } = action.params;

      return transactions.addKey(
        utils.PublicKey.from(publicKey),
        // TODO: Use accessKey.nonce? near-api-js seems to think 0 is fine?
        getAccessKey(accessKey.permission),
      );
    }
    case 'DeleteKey': {
      const { publicKey } = action.params;

      return transactions.deleteKey(utils.PublicKey.from(publicKey));
    }
    case 'DeleteAccount': {
      const { beneficiaryId } = action.params;

      return transactions.deleteAccount(beneficiaryId);
    }
    default:
      throw new Error('Invalid action type');
  }
};
