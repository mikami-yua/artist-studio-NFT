const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFTLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    // 拿到合约的abi
    const ArtistNFT = await ethers.getContractFactory("ArtistNFT");
    // 部署时传入参数
    const nft = await ArtistNFT.deploy();

    return { nft,owner,otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      // loadFixture 测试框架的函数
      const { nft,owner,otherAccount } = await loadFixture(deployNFTLockFixture);
      const address=owner.getAddress();
      await nft.mint(address,"huawei")

      expect(await nft.tokenURI(0)).to.equal("huawei");
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployNFTLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.target)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });


    describe("message",function(){
      it("Should get the right message",async function(){
        const{lock,owner}=await loadFixture(deployOneYearLockFixture);
        expect(await lock.message()).to.equal("Hello World");
      });
      it("Should set the right message",async function(){
        // 合约部署
        const{lock,unlockTime,lockedAmount,owner}= await loadFixture(deployOneYearLockFixture);
        // 使用set函数
        await expect(lock.setMessage("mmmmm")).to.emit(lock,"SetMessage").withArgs("mmmmm");
        await expect(await lock.message()).to.equal("mmmmm")
      });  
    });
  });
});
