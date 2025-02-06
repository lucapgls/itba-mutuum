import { supabase } from '../../supabase_config.js';

export const getWalletBalance = async (walletId) => {
    try {
        console.log("Fetching balance for wallet:", walletId);
        
        // Query the wallet balance from Supabase
        const { data, error } = await supabase
            .from('wallet')
            .select('*')  // Select all columns to debug
            .eq('wallet_id', walletId);

        if (error) {
            console.error('Error fetching wallet balance:', error);
            throw error;
        }

        console.log("Wallet data:", data);

        // Check if we got any results
        if (!data || data.length === 0) {
            console.error(`No wallet found with ID: ${walletId}`);
            // Return default balance of 0
            return {
                data: {
                    tokenBalances: [{
                        amount: "0",
                        token: {
                            id: "USDC",
                            symbol: "USDC",
                            decimals: 6
                        }
                    }]
                }
            };
        }

        // Return the first wallet's balance
        return {
            data: {
                tokenBalances: [{
                    amount: (data[0].balance || 0).toString(),
                    token: {
                        id: "USDC",
                        symbol: "USDC",
                        decimals: 6
                    }
                }]
            }
        };
    } catch (error) {
        console.error('Error in getWalletBalance:', error);
        throw error;
    }
};

export const getWalletBalanceValue = async (walletId) => {
    try {
        console.log("Getting balance value for wallet:", walletId);

        const { data, error } = await supabase
            .from('wallet')
            .select('balance')
            .eq('wallet_id', walletId);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log("Balance data:", data);

        // If no wallet found, return 0 balance
        if (!data || data.length === 0) {
            return [{
                amount: 0,
                token: 'USDC'
            }];
        }

        return [{
            amount: data[0].balance || 0,
            token: 'USDC'
        }];
    } catch (error) {
        console.error('Error getting wallet balance value:', error);
        throw error;
    }
};
