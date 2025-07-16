import { describe, beforeEach, it } from "cypress"
import Cypress from "cypress"

describe("Heart Catcher Game Functionality", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.wait(2000) // Wait for app initialization
  })

  it("should load the game menu", () => {
    cy.contains("Heart Catcher").should("be.visible")
    cy.contains("Start Game").should("be.visible")
    cy.contains("Settings").should("be.visible")
  })

  it("should start the game when Start Game is clicked", () => {
    cy.contains("Start Game").click()
    cy.get("canvas").should("be.visible")
    cy.contains("Score:").should("be.visible")
  })

  it("should open settings menu", () => {
    cy.contains("Settings").click()
    cy.contains("Game Settings").should("be.visible")
    cy.contains("Target Hearts to Win").should("be.visible")
  })

  it("should handle touch controls", () => {
    cy.contains("Start Game").click()
    cy.wait(1000)

    // Simulate touch on left side
    cy.get("canvas").trigger("pointerdown", { clientX: 100, clientY: 400 })
    cy.wait(500)
    cy.get("canvas").trigger("pointerup")

    // Simulate touch on right side
    cy.get("canvas").trigger("pointerdown", { clientX: 250, clientY: 400 })
    cy.wait(500)
    cy.get("canvas").trigger("pointerup")
  })

  it("should pause and resume game", () => {
    cy.contains("Start Game").click()
    cy.wait(1000)

    // Pause game
    cy.get('[data-testid="pause-button"]').click()
    cy.contains("Game Paused").should("be.visible")

    // Resume game
    cy.contains("Resume").click()
    cy.get("canvas").should("be.visible")
  })

  it("should handle audio controls", () => {
    cy.contains("Settings").click()
    cy.contains("Music On").click()
    cy.contains("Music Off").should("be.visible")

    cy.contains("Sound On").click()
    cy.contains("Sound Off").should("be.visible")
  })

  it("should handle file uploads", () => {
    cy.contains("Settings").click()

    // Test video upload
    const videoFile = "test-video.mp4"
    cy.get('input[type="file"][accept="video/*"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake video content"),
        fileName: videoFile,
        mimeType: "video/mp4",
      },
      { force: true },
    )

    cy.contains("Custom video uploaded!").should("be.visible")
  })

  it("should be responsive on different screen sizes", () => {
    // Test mobile portrait
    cy.viewport(375, 667)
    cy.contains("Start Game").should("be.visible")
    cy.get("canvas").should("be.visible")

    // Test tablet
    cy.viewport(768, 1024)
    cy.contains("Start Game").should("be.visible")
    cy.get("canvas").should("be.visible")

    // Test large screen
    cy.viewport(1200, 800)
    cy.contains("Start Game").should("be.visible")
    cy.get("canvas").should("be.visible")
  })
})
