describe('GET /customers API', () => {
  const baseUrl = Cypress.env('API_URL')

  it('Retorna 200 e estrutura correta ao buscar clientes sem parâmetros', () => {
    cy.request('GET', `${baseUrl}/customers`).then(({ status, body }) => {
      expect(status).to.eq(200)
      const { customers, pageInfo } = body
      expect(customers).to.be.an('array')
      expect(pageInfo).to.be.an('object')
      expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
      customers.forEach(({ id, name, employees, contactInfo, size, industry, address }) => {
        expect(id).to.be.a('number')
        expect(name).to.be.a('string')
        expect(employees).to.be.a('number')
        expect(['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']).to.include(size)
        expect(['Logistics', 'Retail', 'Technology', 'HR', 'Finance']).to.include(industry)
        if (contactInfo) expect(contactInfo).to.have.all.keys('name', 'email')
        if (address) expect(address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country')
      })
    })
  })

  it('Filtra clientes por size e industry', () => {
    cy.request('GET', `${baseUrl}/customers?size=Medium&industry=Technology`).then(({ status, body }) => {
      expect(status).to.eq(200)
      const { customers } = body
      customers.forEach(({ size, industry }) => {
        expect(size).to.eq('Medium')
        expect(industry).to.eq('Technology')
      })
    })
  })

  it('Retorna a página correta com o parâmetro page', () => {
    cy.request('GET', `${baseUrl}/customers?page=2`).then(({ status, body }) => {
      expect(status).to.eq(200)
      const { pageInfo } = body
      expect(pageInfo.currentPage).to.eq(2)
    })
  })

  it('Limita o número de resultados com o parâmetro limit', () => {
    cy.request('GET', `${baseUrl}/customers?limit=5`).then(({ status, body }) => {
      expect(status).to.eq(200)
      const { customers } = body
      expect(customers.length).to.be.at.most(5)
    })
  })

  it('Respeita a regra de cálculo do size pelo número de employees', () => {
    cy.request('GET', `${baseUrl}/customers`).then(({ status, body }) => {
      expect(status).to.eq(200)
      const { customers } = body
      customers.forEach(({ employees, size }) => {
        if (employees < 100) expect(size).to.eq('Small')
        else if (employees >= 100 && employees < 1000) expect(size).to.eq('Medium')
        else if (employees >= 1000 && employees < 10000) expect(size).to.eq('Enterprise')
        else if (employees >= 10000 && employees < 50000) expect(size).to.eq('Large Enterprise')
        else expect(size).to.eq('Very Large Enterprise')
      })
    })
  })

  it('Retorna 400 para parâmetro page negativo', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?page=-1`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('Retorna 400 para parâmetro limit negativo', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?limit=-5`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('Retorna 400 para size não suportado', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?size=Micro`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })

  it('Retorna 400 para industry não suportado', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/customers?industry=Food`,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(400)
    })
  })
})