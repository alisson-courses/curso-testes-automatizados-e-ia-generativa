describe('GET /customers API', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('Deve retornar 200 e a estrutura correta ao buscar clientes sem parâmetros', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers').that.is.an('array');
      expect(response.body).to.have.property('pageInfo').that.is.an('object');
      expect(response.body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers');
      response.body.customers.forEach((customer) => {
        expect(customer).to.have.all.keys(
          'id',
          'name',
          'employees',
          'contactInfo',
          'size',
          'industry',
          'address'
        );
        // Validação do tipo de dados
        expect(customer.id).to.be.a('number');
        expect(customer.name).to.be.a('string');
        expect(customer.employees).to.be.a('number');
        expect(['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']).to.include(customer.size);
        expect(['Logistics', 'Retail', 'Technology', 'HR', 'Finance']).to.include(customer.industry);
        // contactInfo e address podem ser null ou objeto
        if (customer.contactInfo) {
          expect(customer.contactInfo).to.have.all.keys('name', 'email');
        }
        if (customer.address) {
          expect(customer.address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country');
        }
      });
    });
  });

  it('Deve filtrar clientes por size e industry', () => {
    cy.request(`${baseUrl}?size=Medium&industry=Technology`).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq('Medium');
        expect(customer.industry).to.eq('Technology');
      });
    });
  });

  it('Deve retornar a página correta com o parâmetro page', () => {
    cy.request(`${baseUrl}?page=2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.pageInfo.currentPage).to.eq(2);
    });
  });

  it('Deve limitar o número de resultados com o parâmetro limit', () => {
    cy.request(`${baseUrl}?limit=5`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.customers.length).to.be.at.most(5);
    });
  });

  it('Deve respeitar a regra de cálculo do size pelo número de employees', () => {
    cy.request(baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        if (customer.employees < 100) expect(customer.size).to.eq('Small');
        else if (customer.employees >= 100 && customer.employees < 1000) expect(customer.size).to.eq('Medium');
        else if (customer.employees >= 1000 && customer.employees < 10000) expect(customer.size).to.eq('Enterprise');
        else if (customer.employees >= 10000 && customer.employees < 50000) expect(customer.size).to.eq('Large Enterprise');
        else expect(customer.size).to.eq('Very Large Enterprise');
      });
    });
  });

  it('Deve retornar 400 para parâmetros inválidos: page negativo', () => {
    cy.request({
      url: `${baseUrl}?page=-1`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Deve retornar 400 para parâmetros inválidos: limit negativo', () => {
    cy.request({
      url: `${baseUrl}?limit=-5`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Deve retornar 400 para size não suportado', () => {
    cy.request({
      url: `${baseUrl}?size=Micro`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Deve retornar 400 para industry não suportado', () => {
    cy.request({
      url: `${baseUrl}?industry=Food`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});