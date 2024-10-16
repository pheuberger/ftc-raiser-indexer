## FTC Fundraiser Indexer

This indexer is designed to track and manage fundraising activities for FTC (Funding the Commons)
using [Envio](https://envio.dev/). It currently focuses on the [splits
contracts](https://splits.org/) and will be expanded to include more features in the future.

### Current Functionality

1. **Splits**

   - Tracks the creation and updates of splits
   - Records distributions made through splits

2. **Entities**
   - `Split`: Represents a split payment configuration
   - `SplitDistribution`: Records individual distributions made through a split

### Planned Future Functionality

1. **Whitelisted Tokens**

   - Will track the tokens accepted by the fundraiser contract

2. **Donations**
   - Will record individual donations made to the fundraiser pool

### Usage

To use this indexer:

1. Ensure you have the Envio CLI installed
2. Clone this repository
3. (optional if you don't want to run in local mode) run `envio codegen`
4. Run `envio dev` to start indexing in development mode

### Configuration

The indexer is configured to track events on the Sepolia testnet (Chain ID: 11155111). It monitors the following contracts:

- SplitMain: `0x22E8ceF567DD10c35F35e03a1dbD25CDa03C4Ac2`
- SplitFactory: `0x80f1B766817D04870f115fEBbcCADF8DBF75E017`

### Event Handlers

The indexer currently handles the following events:

- `SplitCreated`
- `SplitUpdated`
- `SplitDistributed`

For more details on Envio indexer features and usage, please refer to the [Envio documentation website](https://docs.envio.dev).
