# GRAPHQL implementation

### 1. Convert your rest API from week 8 task into GraphQL

### 2. Create an Express Application that implements API using GraphQL and MongoDB

- data structure:
```
 {
      purchasedCars:[
        {
          type:"BMW",
          modelNumber:"3748MXDGH-2020",
          saleDate:"2020-09-10T14:14:08.670Z",
          buyer:"Masashi Kishimato",
          color:"Black"
        },
        {
          type:"AUDI",
          modelNumber:"3748MXDGH-2019",
          saleDate:"2019-09-10T14:14:08.670Z",
          buyer:"Masashi Kishimato",
          color:"Green"
        }
      ],
      allCars:[
          {
            Name:"G-class XSeries",
            type:"Mercedes",
            productionDate:"2018-09-18",
            color:["Teal","green"],
            amount:3,
            condition:"New",
            price:3400000,
      
          },
           {
            Name:"228 Gran Coupe",
            type:"BMW",
            productionDate:"2020-01-10",
            color:["Teal","green"],
            amount:3,
            condition:"Used",
            price:1000000
          },
      ],
      staffs:[
          {
            name:"Freddie Ochukwu",
            position:"Manager",
            salary:250000,
            homeAddress:"No.4 Behind okija, yola, adamawa state,
          },
          {
            name:"Mercury Anumpama",
            position:"Sales",
            salary:25000,
            homeAddress:"No.567 Alhaji Zafiyat estate, yola, adamawa state,
          }
      ],
      
 }
```

- Query:
  - Write a query to retrieve all the data 
  - Write a query to retrieve `purchasedCars`
  - Write a query to retrieve `allCars`
  - Write a query to retrieve `staffs`
  - write a query to retrieve `purchasedCars` based on `type` or `color`
  - write a query to retrieve `allCars` based on `type` or `condition` or `price`
  - write a query to retrieve `staffs` based on `position` or `name`
  
- Mutation:
  - Write a mutation to add details to `purchasedCars`
  - Write a mutation to add details to `allCars`
  - Write a mutation to add details to `staffs`
  - Write a mutation to update details for `purchasedCars`
  - Write a mutation to update details for `allCars`
  - Write a mutation to update details for `staffs`
