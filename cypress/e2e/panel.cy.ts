describe('Panel Navigation', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login')
    cy.get('form').within(() => {
      cy.get('input[type="text"]').type(Cypress.env('TEST_USER_EMAIL'))
      cy.get('input[type="password"]').type(Cypress.env('TEST_USER_PASSWORD'))
      cy.get('button[type="submit"]').click()
    })
    cy.url().should('include', '/panel')
  })

  it('should navigate through panel sections', () => {
    // Test navigation to different sections
    cy.get('[data-testid="nav-menu"]').within(() => {
      // Click each navigation item and verify the URL changes
      cy.contains('Analiz').click()
      cy.url().should('include', '/panel/analiz')

      cy.contains('Visits').click()
      cy.url().should('include', '/panel/visits')

      cy.contains('Items').click()
      cy.url().should('include', '/panel/items')
    })
  })

  it('should persist authentication between page navigations', () => {
    // Navigate to different pages and ensure we stay logged in
    cy.visit('/panel/analiz')
    cy.url().should('include', '/panel/analiz')
    cy.get('[data-testid="user-menu"]').should('exist')

    cy.visit('/panel/visits')
    cy.url().should('include', '/panel/visits')
    cy.get('[data-testid="user-menu"]').should('exist')
  })

  it('should logout successfully', () => {
    // Click user menu and logout
    cy.get('[data-testid="user-menu"]').click()
    cy.contains('Logout').click()

    // Should redirect to login
    cy.url().should('include', '/login')

    // Try to access panel page
    cy.visit('/panel')
    // Should redirect back to login
    cy.url().should('include', '/login')
  })
}) 