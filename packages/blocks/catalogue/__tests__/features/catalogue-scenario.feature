Feature: catalogue

    Scenario: User navigates to catalogue
        Given I am a User loading catalogue
        When I navigate to the catalogue
        Then catalogue will load with out errors
        And when clikcking on the filter icon
        And I can leave the screen with out errors