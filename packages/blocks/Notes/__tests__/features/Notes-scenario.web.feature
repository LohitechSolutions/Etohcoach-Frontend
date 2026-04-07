Feature: Notes

    Scenario: User navigates to Notes
        Given I am a User loading Notes
        When I navigate to the Notes
        Then Notes will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors