
describe('GET /customers API', () => {
  const endpoint = `${Cypress.env('API_URL')}/customers`

  context('Requisição com parâmetros padrão', () => {
    it('retorna status 200 e estrutura correta do corpo da resposta', () => {
      // AAA: Arrange

      // AAA: Act
      cy.request('GET', endpoint).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(200)

        const { customers, pageInfo } = body

        expect(Array.isArray(customers)).to.be.true
        expect(pageInfo).to.be.an('object')

        customers.forEach(customer => {
          const {
            id,
            name,
            employees,
            contactInfo,
            size,
            industry,
            address
          } = customer

          expect(id).to.be.a('number')
          expect(name).to.be.a('string')
          expect(employees).to.be.a('number')
          expect(['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']).to.include(size)
          expect(['Logistics', 'Retail', 'Technology', 'HR', 'Finance']).to.include(industry)

          if (contactInfo) {
            const { name: contactName, email } = contactInfo
            expect(contactName).to.be.a('string')
            expect(email).to.be.a('string')
          } else {
            expect(contactInfo).to.be.null
          }

          if (address) {
            const { street, city, state, zipCode, country } = address
            expect(street).to.be.a('string')
            expect(city).to.be.a('string')
            expect(state).to.be.a('string')
            expect(zipCode).to.be.a('string')
            expect(country).to.eq('United States of America')
          } else {
            expect(address).to.be.null
          }
        })

        expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
        expect(pageInfo.currentPage).to.be.a('number')
        expect(pageInfo.totalPages).to.be.a('number')
        expect(pageInfo.totalCustomers).to.be.a('number')
      })
    })
  })

  context('Paginação - parâmetro page', () => {
    it('retorna dados da página correta ao passar page=2', () => {
      // AAA: Arrange
      const page = 2

      // AAA: Act
      cy.request('GET', `${endpoint}?page=${page}`).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(200)
        const { pageInfo } = body
        expect(pageInfo.currentPage).to.eq(page)
      })
    })

    it('retorna erro quando page=0', () => {
      // AAA: Arrange
      const page = 0

      // AAA: Act
      cy.request({
        method: 'GET',
        url: `${endpoint}?page=${page}`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(400)
        expect(body.error).to.match(/Invalid page or limit/)
      })
    })

    it('retorna erro quando page=-1', () => {
      // AAA: Arrange
      const page = -1

      // AAA: Act
      cy.request({
        method: 'GET',
        url: `${endpoint}?page=${page}`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(400)
        expect(body.error).to.match(/Invalid page or limit/)
      })
    })
  })

  context('Paginação - parâmetro limit', () => {
    it('retorna a quantidade de clientes igual ao limit', () => {
      // AAA: Arrange
      const limit = 5

      // AAA: Act
      cy.request('GET', `${endpoint}?limit=${limit}`).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(200)
        const { customers } = body
        expect(customers.length).to.be.lte(limit)
      })
    })

    it('retorna erro quando limit=0', () => {
      // AAA: Arrange
      const limit = 0

      // AAA: Act
      cy.request({
        method: 'GET',
        url: `${endpoint}?limit=${limit}`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(400)
        expect(body.error).to.match(/Invalid page or limit/)
      })
    })

    it('retorna erro quando limit=-1', () => {
      // AAA: Arrange
      const limit = -1

      // AAA: Act
      cy.request({
        method: 'GET',
        url: `${endpoint}?limit=${limit}`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(400)
        expect(body.error).to.match(/Invalid page or limit/)
      })
    })
  })

  context('Filtragem por size', () => {
    it('retorna apenas clientes do tipo Medium com funcionários adequados', () => {
      // AAA: Arrange
      const size = 'Medium'

      // AAA: Act
      cy.request('GET', `${endpoint}?size=${size}`).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(200)
        const { customers } = body
        customers.forEach(({ size: customerSize, employees }) => {
          expect(customerSize).to.eq(size)
          expect(employees).to.be.gte(100)
          expect(employees).to.be.lt(1000)
        })
      })
    })

    it('retorna erro ao passar size inválido', () => {
      // AAA: Arrange
      const size = 'Micro'

      // AAA: Act
      cy.request({
        method: 'GET',
        url: `${endpoint}?size=${size}`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(400)
        expect(body.error).to.match(/Unsupported size value/)
      })
    })
  })

  context('Filtragem por industry', () => {
    it('retorna apenas clientes do setor Technology', () => {
      // AAA: Arrange
      const industry = 'Technology'

      // AAA: Act
      cy.request('GET', `${endpoint}?industry=${industry}`).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(200)
        const { customers } = body
        customers.forEach(({ industry: cIndustry }) => {
          expect(cIndustry).to.eq(industry)
        })
      })
    })

    it('retorna erro ao passar industry inválido', () => {
      // AAA: Arrange
      const industry = 'Construction'

      // AAA: Act
      cy.request({
        method: 'GET',
        url: `${endpoint}?industry=${industry}`,
        failOnStatusCode: false
      }).then(({ status, body }) => {
        // AAA: Assert
        expect(status).to.eq(400)
        expect(body.error).to.match(/Unsupported industry value/)
      })
    })
  })
})