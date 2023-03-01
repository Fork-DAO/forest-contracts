# Fork Forest Contracts

- Install hardhat
- Install node 16 `nvm install v16.19.1`
- Install all dependencies via `npm ci`
- Run test to verify `npm run test`.

# Testing in local environment

- With hardhat, setup a new node with `npx hardhat node`.
- Then, you can deploy the smart contracts with `npm run deploy-local`.
- Finally, you can run a test task with `npx hardhat test-premint --premintaddress <pre mint contract address> --network localhost`. 