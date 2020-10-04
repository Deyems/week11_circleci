import supertest from 'supertest';
const app = require('../src/app');
const request = supertest(app);
import mongoose from 'mongoose';

afterAll(() => {
	mongoose.connection.close();
}, 4000);
describe('Organization GET routes', () => {
	//ALL ORGANIZATIONS
	it('should return all organizations on database', async (done) => {
		request
			.post('/graphql')
			.send({
				query: `
            {
                allOrganizations{
                    ceo
                    organization_name
                    products
                    marketValue
                }
            }
        `,
			})
			.expect(200)
			.end((err, res) => {
				if (err) done(err);
				// console.log("the response",res.body.data.allOrganizations)
				// expect(res.body.data.allOrganizations).toHaveProperty('organization_name');
				expect(res.body.data.allOrganizations).toBeInstanceOf(Object);
				done();
			});
	});

	//FETCH ONE ORGANIZATION FROM DATABASE
	it('should return One Organization from database', async (done) => {
		const params = {
			query: `{
        oneOrganization(id: "5f5f82dfe5866d7c764c51d1")
        {
            organization_name
            address
            products
        }
        }`,
		};
		// oneOrganization

		const res = await request.post('/graphql').send(params);
		// console.log(res.body.data.oneOrganization);
		// expect(9).toBe(9);
		expect(res.body.data.oneOrganization).toHaveProperty('organization_name');
		done();
	});

	//CREATE ORGANIZATION
	// it('should return the Organization Just added to database', async (done) => {
	//     const params = {query:`mutation{
	//         createOrganization(organizations: {
	//             organization_name: "Jollof Rice house36",
	//             marketValue: 55,
	//             address: "Gombe road Street",
	//             ceo: "Superfan",
	//             country: "Brazil",
	//             products: [ "CopyBoard", "Permutate" ],
	//             employees: [ "Starter Man", "trunkBody" ]
	//             })
	//             {
	//               organization_name
	//               address
	//               ceo
	//               products
	//               employees
	//               country
	//               marketValue
	//             }
	//         }`};
	//     const res = await request.post('/graphql').send(params);
	//     // console.log('RESPONSE ', res.body);
	//     expect(res.body.data.createOrganization).toHaveProperty('organization_name');
	//     expect(res.body.data.createOrganization).toHaveProperty('address');
	//     expect(res.body.data.createOrganization.organization_name).toEqual('Jollof Rice house36');
	//     expect(res.body.data.createOrganization.marketValue).toBe(55);
	//     expect(res.body.data.createOrganization.address).toEqual('Gombe road Street');
	//     expect(res.body.data.createOrganization.ceo).toEqual('Superfan');
	//     expect(res.body.data.createOrganization.country).toEqual('Brazil');
	//     expect(res.body.data.createOrganization.products).toEqual(expect.arrayContaining(['CopyBoard']));
	//     expect(res.body.data.createOrganization.employees).toEqual(expect.arrayContaining(['trunkBody']));
	//     done()
	// });

	//CREATE A USER
	// it('should return the User Details Just added to database', async (done) => {
	//     const params = {query: `mutation{
	//            createUser(userDetails: {
	//              username: "Kabiru Hammad200",
	//              passkey: "12345",
	//              email: "adecob2001@gym.com"
	//            }){
	//              username
	//              email
	//            }
	//         }`};
	//     const res = await request.post('/graphql')
	//     .send(params);
	//     // console.log('Create uSER ', res.body);
	//     expect(res.body.data.createUser).toHaveProperty('username');
	//     expect(res.body.data.createUser).toHaveProperty('email');
	//     expect(res.body.data.createUser).toEqual(expect.objectContaining({ email: 'adecob2001@gym.com'}));
	//     done()
	// });

	//LOGIN USER
	// it('should return the User Details Just logged in to Application', async (done) => {
	//     const params = {query: `{
	//            loginUser(userDetails: {
	//              passkey: "12345",
	//              email: "adecob@gym.com"
	//            }){
	//              username
	//              email
	//            }
	//         }`};
	//     const res = await request.post('/graphql').send(params);
	//     // console.log('Login User ', res.body);
	//     expect(res.body.data.loginUser).toHaveProperty('username');
	//     expect(res.body.data.loginUser).toEqual(expect.objectContaining({email: 'adecob@gym.com'}));
	//     expect(res.body.data.loginUser).toHaveProperty('email');
	//     done()
	// });

	//UPDATE ORGANIZATION
	it('should return the Organization Details FROM DB and SAVE updates to DB', async (done) => {
		const params = {
			query: `mutation{
            updateOrganization(id: "5f736819958bb3e5c2db10b0", organizations:{
                organization_name: "Mountain43",
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
            }`,
		};
		const res = await request.post('/graphql').send(params);
		// console.log('UPDATE org details ', res.body);
		expect(res.body.data.updateOrganization).toHaveProperty('organization_name');
		// expect(res.body.data.updateOrganization.organization_name).toBe
		expect(res.body.data.updateOrganization.organization_name).toEqual('Mountain43');
		expect(res.body.data.updateOrganization).toHaveProperty('address');
		done();
	});

	//UPDATE PRODUCT ARRAY OF AN ORGANIZATION
	it('should return the Product Details Just posted to Application', async (done) => {
		const params = {
			query: `mutation{
                updateProduct(id: "5f5f83233120da7d2304d780",
                oldProduct: "Django",
                newProduct: "Mangonna"){
                    organization_name,
                    products
                }
            }`,
		};
		const res = await request.post('/graphql').send(params);
		// console.log('Product Update Array ', res.body.data.updateProduct.products);
		// expect(res.body.data.updateProduct).toHaveProperty('employees');
		expect(res.body.data.updateProduct).toHaveProperty('organization_name');
		expect(res.body.data.updateProduct).toHaveProperty('products');
		expect(res.body.data.updateProduct.products).toContain('Mangonna');
		done();
	});

	//UPDATE EMPLOYEE OF AN ORGANIZATION
	it('should return the Employee Details Just posted to Application', async (done) => {
		const params = {
			query: `mutation{
                updateEmployee(id: "5f5f83233120da7d2304d780",
                oldEmployee: "Adelabu",
                newEmployee: "Macdonald"){
                    employees
                    organization_name
                }
            }`,
		};
		const res = await request.post('/graphql').send(params);
		// console.log('Employee Update ', res.body);
		expect(res.body.data.updateEmployee).toHaveProperty('employees');
		expect(res.body.data.updateEmployee).toHaveProperty('organization_name');
		// expect(res.body.data.updateEmployee).toHaveProperty('employees');
		expect(res.body.data.updateEmployee.employees).toContain('Macdonald');
		done();
	});

	//DELETE AN ORGANIZATION
	// it('should return the Organization Details Just Deleted FROM Application', async (done) => {
	//     const params = {query: `mutation{
	//             deleteById(id: "5f787cd8717df10d3539c02b"){
	//             organization_name
	//             }
	//         }`};
	//     const res = await request.post('/graphql')
	//     .send(params);
	//     // console.log('Deleted Details ', res.body);
	//     // expect(res.body.data.deleteById).toHaveProperty('employees');
	//     expect(res.body.data.deleteById).toHaveProperty('organization_name');
	//     done()
	// });
});
