describe('Aplicação Refeição Vegana 🌱', () => {
  const url = 'https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html';

  beforeEach(() => {
    cy.visit(url);
  });

  it('Deve carregar a aplicação com título correto', () => {
    cy.contains('Refeição vegana').should('be.visible');
  });

  it('Deve conter os filtros de Tipo e Busca', () => {
    cy.get('select').should('exist').and('have.value', 'all');
    cy.get('input[placeholder="Ex: Arroz e feijão"]').should('exist');
    cy.contains('Buscar').should('exist');
  });

  it('Deve exibir uma sugestão de refeição ao carregar', () => {
    cy.get('h2').should('contain.text', '('); // Ex: "Creme de couve-flor (sopa)"
  });

  it('Deve exibir lista de ingredientes', () => {
    cy.contains('Ingredientes:').should('be.visible');
    cy.get('li').should('have.length.at.least', 1);
  });

  it('Deve permitir filtrar refeições por tipo', () => {
    cy.get('select').select('Sopas');
    cy.contains('Buscar').click();
    cy.get('h2').should('contain.text', 'sopa');
  });

  it('Deve permitir buscar refeições por nome', () => {
    cy.get('input[placeholder="Ex: Arroz e feijão"]').type('feijão');
    cy.contains('Buscar').click();
    cy.get('h2').invoke('text').should('match', /feijão/i);
  });
});
