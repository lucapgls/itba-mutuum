import circleClient from "../../circle_config.js";
import { getWalletBalance } from "./balance.js";
import { supabase } from "../../supabase_config.js";

async function createTransaction(fromWalletId, toWalletId, amount) {
    // Get the balance of the wallet
    const balance = await getWalletBalance(fromWalletId);
    const availableBalance = parseFloat(balance.data.tokenBalances[0].amount); // Assuming balance.data.amount is a string
    const tokenId = balance.data.tokenBalances[0].token.id; // Get the token ID
    // Ensure the amount to send is within the available balance
    if (amount > availableBalance) {
        console.error('Error: Insufficient balance for the transaction.');
        return;
    }


    const response = await supabase.rpc('transaction_between_wallets',
        {
            from_wallet_id: fromWalletId,
            to_wallet_id: toWalletId,
            amount: amount,
        }
    )
    
    if (response.error) {
        console.error('Error creating transaction:', response.error);
        return;
    }

    return response.data;


    // const amountToSend = amount.toString();
    // const toWalletAddress = await getWalletAddress(toWalletId);
    // try {
    //     const response = await circleClient.createTransaction({
    //         walletId: fromWalletId,
    //         tokenId: tokenId, // Use the dynamically obtained token ID
    //         destinationAddress: toWalletAddress,
    //         amounts: [amountToSend],
    //         fee: {
    //             type: 'level',
    //             config: {
    //                 feeLevel: 'LOW',
    //             },
    //         },
    //     });
    //     const ans = {
    //         fromWalletId: fromWalletId,
    //         toWalletId: toWalletId,
    //         amount: amountToSend,
    //         transactionId: response.data.id,
    //         status: response.data.state,
    //     }
    //     return ans;
    // } catch (error) {
    //     console.error('Error creating transaction:', error.response ? error.response.data : error.message);
    // }
}
const getWalletAddress = async (walletId) => {
    const wallet = await circleClient.getWallet({ id: walletId});
    return wallet.data?.wallet.address;
}


export { createTransaction };