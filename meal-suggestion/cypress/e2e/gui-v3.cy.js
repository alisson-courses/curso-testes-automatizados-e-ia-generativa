describe('Meal Suggestion App', () => {
  const baseUrl = 'https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('exibe uma sugestão de refeição ao carregar', () => {
    cy.get('#meal-name').should('not.be.empty');
    cy.get('#ingredients-label').should('have.text', 'Ingredientes:');
    cy.get('#ingredients-list').find('li').should('have.length.greaterThan', 0);
  });

  it('filtra refeições por tipo', () => {
    cy.get('#meal-type-filter').select('Saladas');
    cy.get('#meal-name').should('contain', 'salada');
  });

  it('filtra refeições de alto teor de proteína', () => {
    cy.get('#meal-type-filter').select('Alto teor de proteína');
    cy.get('#meal-name').should('contain', 'proteína');
  });

  it('busca uma refeição pelo nome', () => {
    cy.get('#search-field').type('Feijoada');
    cy.get('button').contains('Buscar').click();
    cy.get('#meal-name').should('contain', 'Feijoada');
    cy.get('#ingredients-list').find('li').should('contain', 'feijão vermelho');
  });
});