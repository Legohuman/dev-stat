## Starting development of this project.

Frontend part is located at **front** folder of project root.

To start development server and watch source files changes, run **yarn start**. 
To execute frontend tests run **yarn test**.
To build frontend part run **yarn build**.

Backend part is located at **back** folder of project root.

To start development install Postgresql 9.4, create user and database according to properties values in src/main/resources/application.properties file.

```
spring.datasource.url=jdbc:postgresql://localhost:45432/devstat
spring.datasource.username=devstatadmin
spring.datasource.password=devstatadminpass
```

Database schema will be created automatically by Flyway migration engine. Migration scripts are located in src/main/resources/db folder.
  
To build backend part run Maven targets **clean** and **package** for /back/pom.xml

Data generators are included in backend part of application and are available via rest API.
See generator-controller section at /swagger-ui.html API documentation page for more information.
To generate data invoke example requests in corresponding Swagger UI section.

## Example requests
### Generation of country summary data

Following request will generate summary data for Russian Federation (RUS code) for time range 01.01.2018 - 31.12.2018 inclusive.
Summary objects will be generated one per day. Values for every measure type will be generated individually according to keys in measureToValuesGenerationRequest object. 
Summary object values will lineally change from startValue at startDate to endValue at endDate. Each value additionally will be randomly shifted up or down for no more than specified deviation value.

`PUT /generators/countries`
```json 
{
  "identity": {
    "countryCode": "RUS",
    "startDate": "01.01.2018",
    "endDate": "31.12.2018"
  },
  "measureToValuesGenerationRequest": {
    "devCount": {
      "startValue": 900000,
      "endValue": 920000,
      "deviation": 500
    },
    "vacancyCount": {
      "startValue": 10000,
      "endValue": 15000,
      "deviation": 200
    },
    "economyLevel": {
      "startValue": 3,
      "endValue": 4,
      "deviation": 1
    }
  }
}
```

### Generation of developer mean data

Following request will generate mean data for Russian Federation (RUS code) for time range 01.01.2018 - 31.12.2018 inclusive.
Developer fact objects count is specified by itemsCount field. Values for every measure type will be generated individually according to keys in measureToValuesGenerationRequest object. 
Developer fact object values will lineally change from startValue at startDate to endValue at endDate. Each value additionally will be randomly shifted up or down for no more than specified deviation value.

`PUT /generators/developers`
```json
{
  "itemsCount": 1000,
  "identity": {
    "countryCode": "RUS",
    "startDate": "01.01.2018",
    "endDate": "31.12.2018"
  },
  "measureToValuesGenerationRequest": {
    "age": {
      "startValue": 25,
      "endValue": 30,
      "deviation": 1
    },
    "salary": {
      "startValue": 2000,
      "endValue": 2500,
      "deviation": 200
    },
    "experience": {
      "startValue": 5,
      "endValue": 7,
      "deviation": 1
    },
    "companySize": {
      "startValue": 300,
      "endValue": 200,
      "deviation": 50
    }
  }
}
```

### Removal of country summary data

Following request will remove summary data for Russian Federation (RUS code) for time range 01.01.2018 - 31.12.2018 inclusive.

`DELETE /generators/countries`
```json 
{
  "countryCode": "RUS",
  "startDate": "01.01.2018",
  "endDate": "31.12.2018"
}
```

### Removal of developer mean data

Following request will remove developer mean data for Russian Federation (RUS code) for time range 01.01.2018 - 31.12.2018 inclusive.

`DELETE /generators/developers`
```json
{
  "countryCode": "RUS",
  "startDate": "01.01.2018",
  "endDate": "31.12.2018"
}
```