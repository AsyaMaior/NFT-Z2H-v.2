const hre = require("hardhat");
const { assert, expect } = require("chai");

describe("NFTmarket", function () {
  let Token, token;
  let owner;
  let acc1;
  let acc2;
  beforeEach(async function () {
    [owner, acc1, acc2] = await ethers.getSigners();
    Token = await hre.ethers.getContractFactory("NFTmarket");
    token = await Token.deploy();
    await token.deployed();
  });

  it("should be deployed", async function () {
    expect(token.address).to.be.properAddress;
  });

  // it("maxSupply is not empty", async function () {
  //   const expectedMaxSupply = "";
  //   const myMaxSupply = token.maxSupply;
  //   assert.equal(Boolean(expectedMaxSupply), !Boolean(myMaxSupply));
  // });

  // it("Should update maxSupply", async function () {
  //   const mySupply = 39;
  //   await token.setMaxSupply(mySupply);
  //   const currentMaxSupply = token.maxSupply;
  //   assert.equal(mySupply, currentMaxSupply);

  //   // expect(currentMaxSupply).to.be.equal(mySupply);
  // });

  it("Should revert if value has less than 0.001 tBNB", async function () {
    await token.activeMint();
    await expect(
      token.mintByLine({
        value: ethers.utils.parseEther("0.0001"),
      })
    ).to.be.revertedWith("You pay incorrect amount of money. Pay 0.001 tBNB");
  });

  // it("should have 0 nft by default", async function () {
  //   const balance = await token.balanceOf(owner);
  //   console.log(balance);
  // });

  it("should we pay the value", async function () {
    await token.activeMint();
    const tx = token.connect(acc2).mintByTokenId(5, {
      value: ethers.utils.parseEther("0.001"),
    });

    await expect(() => tx).to.changeEtherBalance(
      acc2,
      -ethers.utils.parseEther("0.001")
    );
  });
});
