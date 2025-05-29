/// <reference types="cypress" />


import { ThankYouPage } from '../../src/components/ThankYouPage';

describe('ThankYouPage Component', () => {
  const orderNumber = '123456';
  let onBackToStore: Cypress.Agent<sinon.SinonStub>;
  

  beforeEach(() => {
    
    onBackToStore = cy.stub().as('onBackToStore');
    cy.mount(
      <ThankYouPage orderNumber={orderNumber} onBackToStore={onBackToStore} />
    );
  });

  it('deve exibir o título de agradecimento', () => {
    cy.contains('Thank You for Your Purchase!').should('be.visible');
  });

  it('deve exibir a mensagem de confirmação', () => {
    cy.contains("Your order has been successfully placed. We've sent a confirmation email with your order details.").should('be.visible');
  });

  it('deve exibir o número do pedido', () => {
    cy.contains('Order Number').should('be.visible');
    cy.contains(orderNumber).should('be.visible');
  });

  it('deve chamar onBackToStore ao clicar no botão', () => {
    cy.contains('button', 'Back to Store').click();
    cy.get('@onBackToStore').should('have.been.calledOnce');
  });
});