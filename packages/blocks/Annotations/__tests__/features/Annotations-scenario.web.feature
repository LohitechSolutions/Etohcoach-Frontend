Feature: Annotations

    Scenario: User navigates to Annotations
        Given I am a User loading Annotations
        When I navigate to the Annotations
        Then Annotations will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors