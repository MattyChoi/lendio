# QuantStamp Questions
### What is the purpose of your project? What makes it unique?
The purpose of our project is to bring a key part of the traditional financial system to the decentralized world. Our project is unique because corporate bonds have not yet been successfully launched in DeFi.

### How did you design your code? What decisions were made?

We tried to design our code to be readable and run efficiently. However, our primary goal was to make sure the code was working, so some consistency and gas optimization was sacrificed to quickly prototype the product and get it functioning.

### What is the business logic behind all components?
The DealFactory contract is the main contract that overarches the other contracts. The DealFactory deploys a BondManager contract, which controls the ERC-1155 tokens. The DealFactory has a function that allows users to deploy a new Deal contract. The Deal contract allows users and the admin to run a few different operations within the specific deal. Users can deposit money, withdraw that money if the deal is canceled, collect their bond tokens if the deal goes through, and redeem their bond repayment when the bond matures. Admins can cancel the deal, execute the deal, and 

### What does each function do? (In-Line NatSpec documentation preferred)
In-line documentation included in Solidity code.

### How are different functionalities access controlled?
Admin-only functions use require functions to make sure only the admin can perform certain actions. The ERC1155 contract by standard makes use of owner and approval checks.

### How can we set up your project on our local machine? How can we run tests and coverage?
There is a testing.ts file under packages/hardhat. That file was quickly put together, but provides good coverage for the time allotted in the hackathon.