const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    });

    tokenId = 1
 
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            let tokenId = 1
            let cent = "ra_032.155"
            let dec = "dec_121.874"
            let mag = "mag_245.978"

            await this.contract.createStar(tokenId,'Star power 103!', 'I love my wonderful star', dec, mag, cent,{from: accounts[0]})


            this.contract.tokenIdToStarInfo(tokenId).then(result => {
                assert.equal(result[0], "Star power 103!");
                assert.equal(result[1], "I love my wonderful star");
                assert.equal(result[2], "dec_121.874");
                assert.equal(result[3], "mag_245.978");
                assert.equal(result[4], "ra_032.155");
            });
        });

        it('checks if a star already exists', async function () {
            let cent = "ra_032.155"
            let dec = "dec_121.874"
            let mag = "mag_245.978"

            await this.contract.createStar(tokenId, 'Star power 103!','I love my wonderful star', dec, mag, cent, {from: accounts[0]})
            assert.equal(await this.contract.checkIfStarExist(dec, mag, cent), true)
        })

    });


    describe('buying and selling stars', () => { 

        let user1 = accounts[1]
        let user2 = accounts[2]

        let cent = "ra_032.155"
        let dec = "dec_121.874"
        let mag = "mag_245.978"

        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () {
            await this.contract.createStar(starId,'Star power 103!', 'I love my wonderful star', dec, mag, cent,{from: accounts[1]})
        })
    

        describe('user1 can sell a star', () => { 
            it('user1 can put up their star for sale', async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
                assert.equal(await this.contract.starsForSale(starId), starPrice)
            })

            it('user1 gets the funds after selling a star', async function () { 
                let starPrice = web3.toWei(.05, 'ether')
                
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})

                let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                await this.contract.buyStar(starId, {from: user2, value: starPrice})
                let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

                assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                            balanceOfUser1AfterTransaction.toNumber())
            })
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function () { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice})

                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 correctly has their balance changed', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice:0})
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
            })
        })
    })
})

