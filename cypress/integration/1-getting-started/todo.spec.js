/// <reference types="cypress" />

const havetext = (selector, text) => cy.get(selector).should("have.text", text);
const get = cy.get;
const exists = (selector) => cy.get(`.${selector}`).should("exist");
const children = (selector, no) =>
  cy.get(selector).children().should("have.length", no);

const locationIs = (path) => cy.location("pathname").should("equal", path);

describe("c5", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
  });

  it("Should show basic file structure", function () {
    exists("nav");
    exists("navCartCount");
    exists("navCartCheckout");
    children(".container", 10);
    exists("productImage");
    exists("productLink");
    exists("productCategory");
    exists("productPrice");
    exists("productRating");
    exists("productAddtoCart");
  });

  it("should show one card correctly", function () {
    cy.get(".item")
      .eq(3)
      .within((el) => {
        cy.get(".productCategory").should("have.text", "Grocery");
        cy.get(".productLink").should("have.text", "Lays Tangy Tomato");
        cy.get(".productPrice").should("have.text", "$14281");
      });
  });

  it("should be able to add items to cart", function () {
    cy.get(".navCartCount").should("have.text", 0);
    cy.get(".item")
      .eq(3)
      .within((el) => {
        cy.get(".productAddtoCart").should("exist");

        cy.get(".productAddtoCart").click();
      });
    cy.get(".navCartCount").should("have.text", 1);

    cy.get(".item")
      .eq(7)
      .within((el) => {
        cy.get(".productAddtoCart").should("exist");

        cy.get(".productAddtoCart").click();
      });
    cy.get(".navCartCount").should("have.text", 2);
  });

  it("should show details of a product", function () {
    cy.get(".item")
      .eq(0)
      .within((el) => {
        cy.get(".productLink").click();
      });
    exists("detailsTitle");
    exists("detailsImage");
    exists("detailsPrice").should("include.text", "37250");
    exists("review").should("have.length", 2);
  });

  it("should show checkout page correctly", function () {
    cy.get(".item")
      .eq(3)
      .within((el) => {
        cy.get(".productAddtoCart").should("exist");

        cy.get(".productAddtoCart").click();
      });
    get(".navCartCount").should("have.text", 1);

    get(".item")
      .eq(7)
      .within((el) => {
        cy.get(".productAddtoCart").should("exist");

        cy.get(".productAddtoCart").click();
      });
    get(".navCartCount").should("have.text", 2);

    get(".navCartCheckout").click();
    locationIs("/checkout");
    get(".navCartCheckout").should("not.exist");

    get(".navCartCount").should("not.exist");

    get(".total").should("have.text", "49620");
    get(".checkoutWrapper").children().should("have.length", 2);
  });

  it("should show empty cart", function () {
    get(".navCartCheckout").click();
    exists("emptyCart").should("have.text", "Nothing in cart");
  });
});
