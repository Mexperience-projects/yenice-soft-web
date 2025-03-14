describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset any previous state
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('should show login page by default', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.get('form').should('exist')
  })

  it('should show validation errors with invalid credentials', () => {
    cy.visit('/login')
    cy.get('form').within(() => {
      cy.get('input[type="text"]').type('invalid@example.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()
    })
    
    // Check for error message
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('should redirect to panel after successful login', () => {
    cy.visit('/login')
    cy.get('form').within(() => {
      cy.get('input[type="text"]').type(Cypress.env('TEST_USER_EMAIL') || 'test@example.com')
      cy.get('input[type="password"]').type(Cypress.env('TEST_USER_PASSWORD') || 'testpassword')
      cy.get('button[type="submit"]').click()
    })
    
    // Should redirect to panel
    cy.url().should('include', '/panel')
    
    // Should show user is logged in
    cy.get('[data-testid="user-menu"]').should('exist')
  })
}) 