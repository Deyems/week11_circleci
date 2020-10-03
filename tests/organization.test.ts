import supertest from 'supertest';
const app = require('../src/app');
const request = supertest(app)

describe('Organization GET routes', () => {
    //ALL ORGANIZATIONS
    it('should return all organizations on database', async (done) => {
    request
        .post('/graphql')
        .send({query:`
            {
                allOrganizations{
                    ceo
                }
            }
        `})
        .end((err,res)=>{
            if(err) done(err);
            // console.log("the response",res.body.data.allOrganizations)
            expect(res.body.data.allOrganizations).toEqual(expect.arrayContaining([{ceo: 'love3'}]));
            done()
        })
    });

    //FETCH ONE ORGANIZATION FROM DATABASE
    it('should return One Organization from database', async (done) => {
        const params = {query: `{
        oneOrganization(id: "5f65f270d20fee668c1d79d3")
        {
            organization_name
        }
        }`};
        // oneOrganization

        const res = await request.post('/graphql').send(params);
        // console.log(res.body.data.oneOrganization);
        // expect(9).toBe(9);
        expect(res.body.data.oneOrganization).toHaveProperty('organization_name');
        done()
    });
    
    //CREATE ORGANIZATION
    it('should return the Organization Just added to database', async (done) => {
        const params = {query:`mutation{
            createOrganization(organizations: {
                organization_name: "Jollof Rice house5",
                marketValue: 60,
                address: "Gombe road Street",
                ceo: "Superfan",
                country: "Brazil",
                products: [ "Permutate", "ClipBoard" ],
                employees: [ "Starter Man", "Body" ]
                })
                {
                  organization_name
                  address
                  ceo
                  products
                  employees
                  country
                  marketValue
                }
            }`};
        const res = await request.post('/graphql').send(params);
        // console.log('RESPONSE ', res.body);
        expect(res.body.data.createOrganization).toHaveProperty('organization_name');
        expect(res.body.data.createOrganization).toHaveProperty('address');
        expect(res.body.data.createOrganization.organization_name).toEqual('Jollof Rice house5');
        expect(res.body.data.createOrganization.marketValue).toBe(50);
        expect(res.body.data.createOrganization.address).toEqual('Gombe road Street');
        expect(res.body.data.createOrganization.ceo).toEqual('Superfan');
        expect(res.body.data.createOrganization.country).toEqual('Brazil');
        expect(res.body.data.createOrganization.products).toEqual(expect.arrayContaining(['ClipBoard']));
        expect(res.body.data.createOrganization.employees).toEqual(expect.arrayContaining(['Body']));
        done()
    });

    //CREATE A USER
    it('should return the User Details Just added to database', async (done) => {
        const params = {query: `mutation{
               createUser(userDetails: {
                 username: "Kabiru Hammad5",
                 passkey: "12345",
                 email: "adecob61@gym.com"
               }){
                 username
                 email
               }
            }`};
        const res = await request.post('/graphql')
        .send(params);
        // console.log('Create uSER ', res.body);
        expect(res.body.data.createUser).toHaveProperty('username');
        expect(res.body.data.createUser).toHaveProperty('email');
        expect(res.body.data.createUser).toEqual(expect.objectContaining({email: 'adecob61@gym.com'}));
        done()
    });

    //LOGIN USER
    it('should return the User Details Just logged in to Application', async (done) => {
        const params = {query: `{
               loginUser(userDetails: {
                 passkey: "12345",
                 email: "adecob@gym.com"
               }){
                 username
                 email
               }
            }`};
        const res = await request.post('/graphql').send(params);
        // console.log('Login User ', res.body);
        expect(res.body.data.loginUser).toHaveProperty('username');
        expect(res.body.data.loginUser).toEqual(expect.objectContaining({email: 'adecob@gym.com'}));
        expect(res.body.data.loginUser).toHaveProperty('email');
        done()
    });

    //UPDATE ORGANIZATION
    it('should return the Organization Details FROM DB and SAVE updates to DB', async (done) => {
        const params = {query: `mutation{
            updateOrganization(id: "5f65f1ee1398e0658a3eea3a", organizations:{
                organization_name: "Cushionary",
                marketValue: 70,
                address: "4, john bieber",
                ceo: "Fola",
                country: "Brazil",
                products: ["lovely", "terriba"],
                employees: ["poke", "tope"]
                }){
                  organization_name
                  address
                  products
                }
            }`};
        const res = await request.post('/graphql').send(params);
        // console.log('UPDATE org details ', res.body);
        expect(res.body.data.updateOrganization).toHaveProperty('organization_name');
        // expect(res.body.data.updateOrganization.organization_name).toBe
        expect(res.body.data.updateOrganization.organization_name).toEqual('Cushionary');
        expect(res.body.data.updateOrganization).toHaveProperty('address');
        done()
    });

    //UPDATE PRODUCT ARRAY OF AN ORGANIZATION 
    it('should return the Product Details Just posted to Application', async (done) => {
        const params = {query: `mutation{
                updateProduct(id: "5f65f270d20fee668c1d79d3",
                oldProduct: "sqlite",
                newProduct: "Mongoose"){
                    employees
                    organization_name,
                    products
                }
            }`};
        const res = await request.post('/graphql').send(params);
        // console.log('Product Update Array ', res.body.data.updateProduct.products);
        expect(res.body.data.updateProduct).toHaveProperty('employees');
        expect(res.body.data.updateProduct).toHaveProperty('organization_name');
        expect(res.body.data.updateProduct).toHaveProperty('products');
        expect(res.body.data.updateProduct.products).toContain('Mongoose');
        done()
    });
    
    //UPDATE EMPLOYEE OF AN ORGANIZATION
    it('should return the Employee Details Just posted to Application', async (done) => {
        const params = {query: `mutation{
                updateEmployee(id: "5f5f83233120da7d2304d780",
                oldEmployee: "Knox",
                newEmployee: "Magrette"){
                    employees
                    organization_name
                }
            }`};
        const res = await request.post('/graphql').send(params);
        // console.log('Employee Update ', res.body);
        expect(res.body.data.updateEmployee).toHaveProperty('employees');
        expect(res.body.data.updateEmployee).toHaveProperty('organization_name');
        expect(res.body.data.updateEmployee).toHaveProperty('employees');
        expect(res.body.data.updateEmployee.employees).toContain('Magrette');
        done()
    });
    
    //DELETE AN ORGANIZATION 
    it('should return the Organization Details Just Deleted FROM Application', async (done) => {
        const params = {query: `mutation{
                deleteById(id: "5f5f6b4078ddf04870a09585"){
                organization_name
                }
            }`};
        const res = await request.post('/graphql')
        .send(params);
        // expect(res.body.data.deleteById).toHaveProperty('employees');
        expect(res.body.data.deleteById).toHaveProperty('organization_name');
        done()
    });

});
