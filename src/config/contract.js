export const contractMethodOptions = {
    // name of contract you're connecting to
    viewMethods: ["get_num_raffles", "get_num_tickets_sold", "get_contract", "get_token_id", "get_start_time", "get_duration", "get_claimed", "get_winner", "get_entries", "get_raffle", "get_raffles", "get_token"], // view methods do not change state but usually return a value
    changeMethods: ["create_raffle", "enter", "claim", "withdraw", "withdraw_ft"], // change methods modify state
}

// export const RaffleContractAddress = "dev-1663328366903-89901516099283";
export const RaffleContractAddress = "degenverse-raffles.near";
export const TokenContractAddress = "rocketbois-reward.near";
// export const TokenContractAddress = "dfg1234.testnet";

export const GAS = "300000000000000";

export const STORAGEDEPOSITAMOUNT = "10000000000000000000000";

export const Yocto = 1000000000000000000000000;