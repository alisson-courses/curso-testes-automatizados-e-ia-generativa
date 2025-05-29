describe('Meal Suggestion App', () => {
  const url = 'https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html';

  beforeEach(() => {
    cy.visit(url);
  });

  it('deve carregar a página corretamente', () => {
    cy.contains('Refeição vegana 🌱').should('be.visible');
  });

  it('deve sugerir uma refeição ao clicar no botão', () => {
    // Supondo que exista um botão para sugerir refeição
    cy.get('button').contains('Buscar').click();
    // Supondo que a sugestão aparece em um elemento com id ou classe
    cy.get('h2#meal-name[title="Refeição"]')
      .should('be.visible')
      .and('not.be.empty');
  });

  it('deve exibir detalhes da refeição sugerida', () => {
    cy.get('button').contains('Buscar').click();
    cy.get('#ingredients-label').then(($ingredients) => {
      // Exemplo: verifica se tem algum texto com ingredientes ou instruções
      cy.wrap($ingredients).should('contain.text', 'Ingredientes');
    });
  });

  // Adicione mais testes conforme funcionalidades da aplicação
});