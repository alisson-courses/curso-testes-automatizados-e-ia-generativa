//refactoring test with Perpleity AI

describe('Emoji Mart App - Cobertura Completa', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve exibir a homepage com lista de emojis', () => {
    cy.get('h1').contains('EmojiMart');
    cy.get('input[placeholder="Search emojis..."]').should('be.visible');
    cy.get('[data-testid="emoji-card"]').should('have.length.at.least', 1).and('be.visible');
  });

  it('deve buscar emojis por nome (case insensitive)', () => {
    cy.get('input[placeholder="Search emojis..."]').type('rocket');
    cy.get('[data-testid="emoji-card"]').should('have.length', 1);
    cy.get('[data-testid="emoji-card"]').contains('🚀').should('be.visible');
    cy.get('input[placeholder="Search emojis..."]').clear().type('ROCKET');
    cy.get('[data-testid="emoji-card"]').contains('🚀').should('be.visible');
  });

  it('deve exibir detalhes do emoji e voltar para a lista', () => {
    cy.get('[data-testid="emoji-card"]').first().click();
    cy.url().should('include', '/emoji/');
    cy.get('[data-testid="emoji-detail"]').should('be.visible');
    cy.get('button').contains('Back to all emojis').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve adicionar emoji ao carrinho pela homepage e pela página de detalhes', () => {
    // Pela homepage
    cy.get('[data-testid="emoji-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.get('.lucide-shopping-cart').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);

    // Pela página de detalhes
    cy.get('button[aria-label="Close cart"]').click();
    cy.get('[data-testid="emoji-card"]').eq(1).click();
    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 2);
  });

  it('deve atualizar quantidade e remover emoji do carrinho', () => {
    cy.get('[data-testid="emoji-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.get('.lucide-shopping-cart').click();
    cy.get('[data-testid="cart-item-counter"]').contains('1');
    cy.get('button svg.lucide-plus-circle').click();
    cy.get('[data-testid="cart-item-counter"]').contains('2');
    cy.get('button svg.lucide-minus-circle').click();
    cy.get('[data-testid="cart-item-counter"]').contains('1');
    cy.get('button svg.lucide-trash2').click();
    cy.get('[data-testid="empty-cart"]').contains('Your cart is empty').should('be.visible');
  });

  it('deve persistir carrinho após refresh', () => {
    cy.get('[data-testid="emoji-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.get('.lucide-shopping-cart').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.reload();
    cy.get('.lucide-shopping-cart').click();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });

  it('deve fechar e abrir o carrinho', () => {
    cy.get('[data-testid="emoji-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.get('.lucide-shopping-cart').click();
    cy.get('button[aria-label="Close cart"]').click();
    cy.get('[data-testid="cart-item"]').should('not.exist');
  });

  it('deve realizar checkout com validação de campos obrigatórios', () => {
    cy.get('[data-testid="emoji-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.get('.lucide-shopping-cart').click();
    cy.contains('button', 'Checkout').click();

    // Tentar submeter sem preencher
    cy.contains('button', 'Complete Purchase').click();
    cy.contains('Please enter a valid email').should('be.visible');
    cy.contains('Please enter your full name').should('be.visible');
    cy.contains('Please enter your address').should('be.visible');
    cy.contains('Please enter your card number').should('be.visible');

    // Preencher dados válidos
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="address"]').type('Rua Exemplo, 123');
    cy.get('input[name="city"]').type('São Paulo');
    cy.get('input[name="country"]').type('Brasil');
    cy.get('input[name="cardNumber"]').type('4111111111111111');
    cy.get('input[name="expiry"]').type('12/30');
    cy.get('input[name="cvv"]').type('123');

    // Verificar valor total antes de finalizar
    cy.get('[data-testid="total-amount"]').should('be.visible');

    // Voltar para loja antes de finalizar
    cy.contains('button', 'Back to store').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Voltar para checkout e finalizar compra
    cy.get('.lucide-shopping-cart').click();
    cy.contains('button', 'Checkout').click();
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="address"]').type('Rua Exemplo, 123');
    cy.get('input[name="city"]').type('São Paulo');
    cy.get('input[name="country"]').type('Brasil');
    cy.get('input[name="cardNumber"]').type('4111111111111111');
    cy.get('input[name="expiry"]').type('12/30');
    cy.get('input[name="cvv"]').type('123');
    cy.contains('button', 'Complete Purchase').click();

    // Página de agradecimento
    cy.contains('Thank You for Your Purchase!').should('be.visible');
    cy.contains("Your order has been successfully placed. We've sent a confirmation email with your order details.").should('be.visible');
    cy.get('[data-testid="order-number"]').should('be.visible');
    cy.contains('button', 'Back to Store').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve ser responsivo (mobile)', () => {
    cy.viewport('iphone-6');
    cy.get('h1').should('be.visible');
    cy.get('[data-testid="emoji-card"]').should('be.visible');
    cy.get('.lucide-shopping-cart').should('be.visible');
  });
});
