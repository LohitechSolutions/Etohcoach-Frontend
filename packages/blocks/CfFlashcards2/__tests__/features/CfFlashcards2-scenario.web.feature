Feature: CfFlashcards2

    Scenario: User navigates to CfFlashcards2
        Given I am a User loading CfFlashcards2
        When I navigate to the CfFlashcards2
        Then CfFlashcards2 will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors