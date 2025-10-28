/// <reference types="cypress" />

describe('Constructor Page', () => {
  const SELECTORS = {
    ingredient: '[data-testid="ingredient"]',
    constructor: '[data-testid="constructor"]',
    modal: '[data-testid="modal"]',
    modalClose: '[data-testid="modal-close"]',
    modalOverlay: '[data-testid="modal-overlay"]',
    orderButton: '[data-testid="order-button"]',
    orderModal: '[data-testid="order-modal"]'
  };

  const TEST_DATA = {
    bunName: 'Краторная булка N-200i',
    orderNumber: '12345'
  };

  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    cy.setCookie('accessToken', 'fake-access-token');
    
    cy.visit('/');
    
    // Ожидаем загрузки API
    cy.wait('@getIngredients');
    cy.wait('@getUser');
    
    // Проверяем основные элементы интерфейса
    cy.contains('Соберите бургер').should('be.visible');
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    
    // Ждем появления ингредиентов
    cy.get(SELECTORS.ingredient, { timeout: 15000 }).should('have.length.greaterThan', 0);
    
    // Проверяем, что конструктор загрузился (существует в DOM)
    cy.get(SELECTORS.constructor).should('exist');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookies();
  });

  it('should display the main title', () => {
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('should display ingredients sections', () => {
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
  });

  it('should display constructor area', () => {
    cy.get(SELECTORS.constructor).should('exist');
    cy.contains('Оформить заказ').should('be.visible');
  });

  it('should add bun to constructor on click', () => {
    cy.get(SELECTORS.ingredient).first().click();
    cy.get(SELECTORS.constructor).contains(TEST_DATA.bunName);
  });

  it('should open ingredient modal on click', () => {
  cy.get(SELECTORS.ingredient).contains('Биокотлета').click();
  // Вместо проверки видимости — ждём содержимое
  cy.get(SELECTORS.modal).contains('Биокотлета из марсианской Магнолии');
});

    it('should close ingredient modal on close button click', () => {
    cy.get(SELECTORS.ingredient).contains('Биокотлета').click();
    cy.get(SELECTORS.modal).contains('Биокотлета из марсианской Магнолии');
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
    });

    it('should close ingredient modal on overlay click', () => {
    cy.get(SELECTORS.ingredient).contains('Биокотлета').click();
    cy.get(SELECTORS.modal).contains('Биокотлета из марсианской Магнолии');
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
    });

  it('should create order successfully', () => {
    // Добавляем булку
    cy.get(SELECTORS.ingredient).contains('Краторная булка').click();
    cy.get(SELECTORS.constructor).contains(TEST_DATA.bunName);

    // Создаем заказ
    cy.get(SELECTORS.orderButton).click();
    cy.wait('@createOrder');

    // Проверяем модальное окно заказа
    cy.get(SELECTORS.orderModal).should('be.visible');
    cy.get(SELECTORS.orderModal).contains(TEST_DATA.orderNumber);

    // Закрываем модальное окно
    cy.get(SELECTORS.modalClose).click();
    
    // Проверяем, что конструктор очистился
    cy.get(SELECTORS.constructor).should('not.contain', TEST_DATA.bunName);
  });

  it('should show order button', () => {
    cy.contains('Оформить заказ').should('be.visible');
  });
});
